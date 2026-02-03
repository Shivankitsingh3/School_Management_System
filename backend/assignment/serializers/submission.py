from rest_framework import serializers
from assignment.models.submission import AssignmentSubmission
from django.utils import timezone
from django.conf import settings
import os


class AssignmentSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = [
            'answer_text',
            'answer_file',
        ]

    def validate_answer_file(self, file):
        if file:
            if file.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "File size must not exceed 5MB."
                )

            ext = os.path.splitext(file.name)[1][1:].lower()
            allowed = getattr(settings, 'ALLOWED_UPLOAD_EXTENSIONS',
                              ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'xlsx', 'xls'])

            if ext not in allowed:
                raise serializers.ValidationError(
                    f"File type '.{ext}' is not allowed. Allowed types: {', '.join(allowed)}"
                )

        return file

    def validate(self, attrs):
        assignment = self.context['assignment']
        student = self.context['student']

        if not assignment.is_active:
            raise serializers.ValidationError("Assignment is closed.")

        if timezone.now() > assignment.due_date:
            raise serializers.ValidationError(
                'Submission deadline has passed.'
            )

        if student.classroom != assignment.classroom:
            raise serializers.ValidationError(
                'This assignment is not for your class.'
            )

        if AssignmentSubmission.objects.filter(
            assignment=assignment,
            student=student
        ).exists():
            raise serializers.ValidationError(
                'You have already submitted this assignment.'
            )

        if not attrs.get('answer_text') and not attrs.get('answer_file'):
            raise serializers.ValidationError(
                'Please provide either answer text or upload a file.'
            )

        return attrs

    def create(self, validated_data):
        return AssignmentSubmission.objects.create(
            assignment=self.context['assignment'],
            student=self.context['student'],
            **validated_data
        )


class AssignmentSubmissionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.name',
        read_only=True
    )
    student_registration_id = serializers.CharField(
        source='student.registration_id',
        read_only=True
    )
    student_classroom = serializers.CharField(
        source='student.classroom.name',
        read_only=True
    )

    assignment_title = serializers.CharField(
        source='assignment.title',
        read_only=True
    )
    subject = serializers.CharField(
        source='assignment.subject.name',
        read_only=True
    )
    max_marks = serializers.IntegerField(
        source='assignment.max_marks',
        read_only=True
    )

    answer_file_url = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentSubmission
        fields = [
            'id',
            'assignment',
            'assignment_title',
            'subject',
            'student_name',
            'student_registration_id',
            'student_classroom',
            'submitted_at',
            'marks_obtained',
            'max_marks',
            'teacher_feedback',
            'answer_text',
            'answer_file',
            'answer_file_url',
        ]

    def get_answer_file_url(self, obj):
        if obj.answer_file:
            return obj.answer_file.url
        return None


class AssignmentSubmissionEvaluateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['marks_obtained', 'teacher_feedback']

    def validate_marks_obtained(self, value):
        assignment = self.instance.assignment
        if value < 0 or value > assignment.max_marks:
            raise serializers.ValidationError(
                f"Marks must be between 0 and {assignment.max_marks}"
            )
        return value
