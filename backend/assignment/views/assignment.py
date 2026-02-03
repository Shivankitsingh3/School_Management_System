from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from assignment.models.assignment import Assignment
from assignment.serializers.assignment import (
    AssignmentCreateSerializer,
    AssignmentListSerializer,
    AssignmentDetailSerializer,
    StudentAssignmentListSerializer
)
from assignment.permissions import IsTeacher, IsAssignmentOwner
from rest_framework.permissions import IsAuthenticated


class AssignmentCreateView(CreateAPIView):
    serializer_class = AssignmentCreateSerializer
    permission_classes = [IsTeacher]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AssignmentListView(ListAPIView):
    def get_serializer_class(self):
        if self.request.user.role == "student":
            return StudentAssignmentListSerializer
        return AssignmentListSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Assignment.objects.select_related(
            'teacher', 'subject', 'classroom')

        if user.role == 'student':
            student_classroom = user.student_profile.classroom
            return qs.filter(
                classroom=student_classroom,
                is_active=True
            ).order_by('-created_at')

        if user.role == 'teacher':
            return qs.filter(teacher=user.teacher_profile).order_by('-created_at')

        if user.role == 'principal':
            return qs.order_by('-created_at')

        return Assignment.objects.none()


class AssignmentDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AssignmentDetailSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Assignment.objects.select_related('teacher', 'classroom')

        if user.role == 'student':
            student_classroom = user.student_profile.classroom
            return qs.filter(
                classroom=student_classroom,
                is_active=True
            )

        if user.role == 'teacher':
            return qs.filter(teacher=user.teacher_profile)

        if user.role == 'principal':
            return qs

        return Assignment.objects.none()

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsTeacher(), IsAssignmentOwner()]
        return [IsAuthenticated()]
