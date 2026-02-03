from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, F, FloatField
from django.db.models.functions import Cast

from attendance.models import Attendance, AttendanceRecord
from attendance.serializers import (
    BulkAttendanceSerializer,
    StudentAttendanceListSerializer,
    AttendanceDetailSerializer,
)
from attendance.permissions import IsTeacher, IsStudent, IsPrincipalReadOnly, CanViewStudentList
from teacher.models import TeacherSubject


class AttendanceCreateView(CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = BulkAttendanceSerializer
    permission_classes = [IsTeacher]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        date = request.data.get('date')
        classroom = request.data.get('classroom')
        subject = request.data.get('subject')

        existing = Attendance.objects.filter(
            date=date,
            classroom_id=classroom,
            subject_id=subject,
            teacher=request.user.teacher_profile
        ).exists()

        if existing:
            return Response(
                {
                    'detail': 'Attendance has already been marked for this date, classroom, and subject.',
                    'error': 'duplicate'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)


class TeacherDailyAttendanceReportView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        subject_id = request.query_params.get('subject')
        classroom_id = request.query_params.get('classroom')
        date = request.query_params.get('date')

        if not subject_id or not classroom_id or not date:
            return Response(
                {'detail': 'subject, classroom, and date are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        teacher = request.user.teacher_profile

        if not TeacherSubject.objects.filter(
            teacher=teacher,
            subject_id=subject_id,
            classroom_id=classroom_id
        ).exists():
            return Response(
                {'detail': 'You are not assigned to this subject/classroom.'},
                status=status.HTTP_403_FORBIDDEN
            )

        qs = AttendanceRecord.objects.filter(
            attendance__teacher=teacher,
            attendance__subject_id=subject_id,
            attendance__classroom_id=classroom_id,
            attendance__date=date
        )

        report = qs.aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(status='P')),
            absent=Count('id', filter=Q(status='A')),
            leave=Count('id', filter=Q(status='L')),
        )

        return Response({
            'date': date,
            'subject_id': subject_id,
            'classroom_id': classroom_id,
            'summary': report
        })


class TeacherStudentAttendancePercentageView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        subject_id = request.query_params.get('subject')
        classroom_id = request.query_params.get('classroom')

        if not subject_id or not classroom_id:
            return Response(
                {'detail': 'subject and classroom are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        teacher = request.user.teacher_profile

        if not TeacherSubject.objects.filter(
            teacher=teacher,
            subject_id=subject_id,
            classroom_id=classroom_id
        ).exists():
            return Response(
                {'detail': 'You are not assigned to this subject/classroom.'},
                status=status.HTTP_403_FORBIDDEN
            )

        qs = (
            AttendanceRecord.objects.filter(
                attendance__teacher=teacher,
                attendance__subject_id=subject_id,
                attendance__classroom_id=classroom_id
            )
            .values(
                'student__id',
                'student__user__email',
                'student__user__name',
                'student__registration_id'
            )
            .annotate(
                total_days=Count('id'),
                present_days=Count('id', filter=Q(status='P')),
                absent_days=Count('id', filter=Q(status='A')),
                leave_days=Count('id', filter=Q(status='L'))
            )
            .annotate(
                attendance_percentage=Cast(
                    F('present_days') * 100.0 / F('total_days'),
                    FloatField()
                )
            )
        )

        return Response(qs)




class StudentAttendanceListView(ListAPIView):
    serializer_class = StudentAttendanceListSerializer
    permission_classes = [IsAuthenticated, CanViewStudentList]

    def get_queryset(self):
        return AttendanceRecord.objects.filter(
            student=self.request.user.student_profile
        ).select_related(
            'attendance__teacher',
            'attendance__subject'
        ).order_by('-attendance__date')



class StudentAttendanceSummaryView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        qs = AttendanceRecord.objects.filter(
            student=request.user.student_profile
        ).select_related('attendance__subject')

        summary = qs.values(
            'attendance__subject__id',
            'attendance__subject__name',
            'student__user__name',
            'student__registration_id',
        ).annotate(
            total_days=Count('id'),
            present_days=Count('id', filter=Q(status='P')),
            absent_days=Count('id', filter=Q(status='A')),
            leave_days=Count('id', filter=Q(status='L'))
        )

        result = [
            {
                'subject_id': item['attendance__subject__id'],
                'subject_name': item['attendance__subject__name'],
                'student_name': item['student__user__name'],
                'student_id': item['student__registration_id'],
                'total_days': item['total_days'],
                'present_days': item['present_days'],
                'absent_days': item['absent_days'],
                'leave_days': item['leave_days'],
                'attendance_percentage': (
                    (item['present_days'] / item['total_days'] * 100)
                    if item['total_days'] > 0 else 0
                )
            }
            for item in summary
        ]

        return Response(result)



class AttendanceListView(ListAPIView):
    serializer_class = AttendanceDetailSerializer
    permission_classes = [IsPrincipalReadOnly]

    def get_queryset(self):
        qs = Attendance.objects.select_related(
            'teacher',
            'classroom',
            'subject'
        ).prefetch_related('records')
        classroom_id = self.request.query_params.get('classroom')
        subject_id = self.request.query_params.get('subject')
        date = self.request.query_params.get('date')

        if classroom_id:
            qs = qs.filter(classroom_id=classroom_id)

        if subject_id:
            qs = qs.filter(subject_id=subject_id)

        if date:
            qs = qs.filter(date=date)

        return qs.order_by('-date')



class PrincipalDailyAttendanceReportView(APIView):
    permission_classes = [IsPrincipalReadOnly]

    def get(self, request):
        date = request.query_params.get('date')
        classroom_id = request.query_params.get('classroom')
        subject_id = request.query_params.get('subject')

        if not date:
            return Response(
                {'detail': 'date is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = AttendanceRecord.objects.filter(attendance__date=date)

        if classroom_id:
            qs = qs.filter(attendance__classroom_id=classroom_id)

        if subject_id:
            qs = qs.filter(attendance__subject_id=subject_id)

        report = qs.aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(status='P')),
            absent=Count('id', filter=Q(status='A')),
            leave=Count('id', filter=Q(status='L')),
        )

        return Response({
            'date': date,
            'classroom_id': classroom_id,
            'subject_id': subject_id,
            'summary': report
        })



class PrincipalStudentAttendancePercentageView(APIView):
    permission_classes = [IsPrincipalReadOnly]

    def get(self, request):
        subject_id = request.query_params.get('subject')
        classroom_id = request.query_params.get('classroom')

        if not classroom_id:
            return Response(
                {'detail': 'classroom_id is required to view student-wise data.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        qs = AttendanceRecord.objects.filter(
            attendance__classroom_id=classroom_id)

        if subject_id:
            qs = qs.filter(attendance__subject_id=subject_id)

        report = (
            qs.values(
                'student__id',
                'student__user__name',
                'student__registration_id'
            )
            .annotate(
                total_days=Count('id'),
                present_days=Count('id', filter=Q(status='P')),
                absent_days=Count('id', filter=Q(status='A')),
                leave_days=Count('id', filter=Q(status='L'))
            )
            .annotate(
                attendance_percentage=Cast(
                    F('present_days') * 100.0 / F('total_days'),
                    FloatField()
                )
            )
            .order_by('student__user__name')
        )

        return Response(report)
