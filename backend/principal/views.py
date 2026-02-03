from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count

from teacher.models import Teacher, TeacherSubject
from classroom.models import ClassRoom
from assignment.models.assignment import Assignment
from teacher.serializers import TeacherListSerializer
from principal.serializers import AssignTeacherSerializer, PrincipalProfileSerializer
from account.permissions import IsPrincipal

# Create your views here.
    

class PrincipalSelfProfileView(RetrieveAPIView):
    serializer_class = PrincipalProfileSerializer
    permission_classes = [IsAuthenticated, IsPrincipal]
    
    def get_object(self):
        return self.request.user.principal_profile


class PrincipalAssignTeacherView(ListCreateAPIView):
    queryset = TeacherSubject.objects.select_related(
        'teacher__user', 'classroom', 'subject'
    )
    serializer_class = AssignTeacherSerializer
    permission_classes = [IsAuthenticated, IsPrincipal]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Teacher assigned and notified successfully."},
            status=status.HTTP_201_CREATED
        )


class PendingTeacherListView(APIView):
    permission_classes = [IsPrincipal]

    def get(self, request):
        teachers = (
            Teacher.objects
            .annotate(assignment_count=Count('assigned_subjects'))
            .filter(assignment_count=0)
        )
        serializer = TeacherListSerializer(teachers, many=True)
        return Response(serializer.data)



class PrincipalDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsPrincipal]

    def get(self, request):
        total_teachers = Teacher.objects.count()

        assigned_teachers = (
            Teacher.objects
            .annotate(assign_count=Count('assigned_subjects'))
            .filter(assign_count__gt=0)
            .count()
        )

        pending_teachers = total_teachers - assigned_teachers

        total_classrooms = ClassRoom.objects.count()

        active_assignments = Assignment.objects.filter(is_active=True).count()

        return Response({
            "teachers": {
                "total": total_teachers,
                "assigned": assigned_teachers,
                "pending": pending_teachers,
            },
            "classrooms": {
                "total": total_classrooms,
            },
            "assignments": {
                "active": active_assignments,
            }
        })
