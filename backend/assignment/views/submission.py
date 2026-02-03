from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from assignment.models.assignment import Assignment
from assignment.models.submission import AssignmentSubmission
from assignment.serializers.submission import (
    AssignmentSubmissionCreateSerializer,
    AssignmentSubmissionListSerializer,
    AssignmentSubmissionEvaluateSerializer
)
from assignment.permissions import IsStudent, IsTeacher
from django.shortcuts import get_object_or_404
from django.utils import timezone
from assignment.ai_utils import get_submission_feedback



class AssignmentSubmissionCreateView(CreateAPIView):
    serializer_class = AssignmentSubmissionCreateSerializer
    permission_classes = [IsStudent]

    def get_assignment(self):
        return get_object_or_404(
            Assignment,
            id=self.kwargs['assignment_id'],
            is_active=True
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['assignment'] = self.get_assignment()
        context['student'] = self.request.user.student_profile
        return context


class StudentSubmissionListView(ListAPIView):
    serializer_class = AssignmentSubmissionListSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            student=self.request.user.student_profile
        ).select_related(
            'assignment',
            'assignment__subject',
            'assignment__classroom'
        ).order_by('-submitted_at')


class TeacherAssignmentSubmissionListView(ListAPIView):
    serializer_class = AssignmentSubmissionListSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        teacher = self.request.user.teacher_profile

        return (
            AssignmentSubmission.objects
            .select_related(
                'student__user',
                'assignment',
                'assignment__subject',
                'assignment__classroom'
            )
            .filter(assignment__teacher=teacher)
            .order_by('-submitted_at')
        )


class AssignmentSubmissionEvaluateView(UpdateAPIView):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionEvaluateSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_object(self):
        obj = super().get_object()
        teacher = self.request.user.teacher_profile

        if obj.assignment.teacher != teacher:
            raise PermissionDenied("You cannot evaluate this submission.")

        return obj

    def perform_update(self, serializer):
        serializer.save(evaluated_at=timezone.now())


class AISuggestionView(APIView):
    permission_classes = [IsTeacher]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'ai_limit'

    def get(self, request, pk):
        submission = get_object_or_404(
            AssignmentSubmission,
            pk=pk,
            assignment__teacher=request.user.teacher_profile
        )

        try:
            file_location = None
            if submission.answer_file:
                try:
                    file_location = submission.answer_file.url
                except ValueError:
                    file_location = submission.answer_file.path if hasattr(
                        submission.answer_file, 'path') else None

            suggestion = get_submission_feedback(
                assignment_title=submission.assignment.title,
                assignment_desc=submission.assignment.description or "No specific criteria provided",
                student_answer=submission.answer_text or "",
                assignment_max_marks=submission.assignment.max_marks,
                file_path=file_location
            )

            return Response({
                'suggestion': suggestion,
                'submission_id': submission.id,
                'has_file': bool(submission.answer_file),
                'has_text': bool(submission.answer_text)
            })

        except Exception as e:
            return Response(
                {
                    'error': 'Failed to generate AI suggestion',
                    'detail': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
