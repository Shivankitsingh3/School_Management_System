from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Student
from .serializers import (
    StudentProfileSerializer,
    StudentListSerializer,
)
from account.permissions import IsStudent, IsTeacherOrPrincipal

# Create your views here.


from django.db.models import Q
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


class StudentListView(ListAPIView):
    serializer_class = StudentListSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    filterset_fields = ['classroom']
    search_fields = ['user__name', 'user__email', 'registration_id']

    def get_queryset(self):
        qs = Student.objects.select_related('user', 'classroom')
        user = self.request.user

        if user.role == 'student':
            qs = qs.filter(classroom_id=user.student_profile.classroom_id)

        elif user.role == 'teacher':
            teacher_classrooms = user.teacher_profile.assigned_subjects.values_list(
                'classroom_id', flat=True
            ).distinct()
            qs = qs.filter(classroom_id__in=teacher_classrooms)

        return qs.order_by('user__name')



class StudentSelfProfileView(RetrieveAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_object(self):
        return self.request.user.student_profile


class StudentDetailView(RetrieveAPIView):
    queryset = Student.objects.select_related('user', 'classroom')
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrPrincipal]
