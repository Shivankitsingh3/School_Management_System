from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Teacher, TeacherSubject
from .serializers import (
    TeacherListSerializer,
    TeacherProfileSerializer,
    TeacherSubjectSerializer,
)
from account.permissions import IsTeacher, IsPrincipal, IsTeacherOrPrincipal


class TeacherListView(ListAPIView):
    serializer_class = TeacherListSerializer
    permission_classes = [IsAuthenticated, IsPrincipal]
    
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    
    search_fields = ['user__name', 'registration_id', 'user__email']


    def get_queryset(self):
        qs = Teacher.objects.select_related('user').all()

        classroom_id = self.request.query_params.get('classroom')

        if classroom_id:
            qs = qs.filter(
                assigned_subjects__classroom_id=classroom_id
            ).distinct()

        return qs.order_by('user__name')


class TeacherSelfProfileView(RetrieveAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_object(self):
        return self.request.user.teacher_profile


class TeacherAssignedClassroomsView(ListAPIView):
    permission_classes = [IsAuthenticated, IsTeacherOrPrincipal]

    def get(self, request):
        teacher = request.user.teacher_profile

        classrooms = TeacherSubject.objects.filter(
            teacher=teacher
        ).select_related('classroom').values(
            'classroom__id',
            'classroom__name'
        ).distinct()

        data = [
            {'id': c['classroom__id'], 'name': c['classroom__name']}
            for c in classrooms
        ]

        return Response(data)



class TeacherAssignedSubjectsView(ListAPIView):
    serializer_class = TeacherSubjectSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        teacher = self.request.user.teacher_profile
        classroom_id = self.request.query_params.get('classroom')

        qs = TeacherSubject.objects.filter(
            teacher=teacher
        ).select_related('classroom', 'subject')

        if classroom_id:
            qs = qs.filter(classroom_id=classroom_id)

        return qs



class TeacherDetailView(RetrieveAPIView):
    queryset = Teacher.objects.select_related('user')
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated, IsPrincipal]
