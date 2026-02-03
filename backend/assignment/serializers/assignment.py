from rest_framework import serializers
from assignment.models.assignment import Assignment
from teacher.models import TeacherSubject
from django.utils import timezone


class AssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = [
            'classroom',
            'subject',
            'title',
            'description',
            'due_date',
            'max_marks',
        ]
    
    def validate(self, attrs):
        request = self.context['request']
        teacher = request.user.teacher_profile
        subject = attrs['subject']
        classroom = attrs['classroom']
        
        if subject.classroom != classroom:
            raise serializers.ValidationError(
                'Subject does not belong to the selected classroom.'
            )
        
        if not TeacherSubject.objects.filter(
            teacher=teacher,
            subject=subject
        ).exists():
            raise serializers.ValidationError(
                'You are not assigned to this subject.'
            )
        return attrs
        
    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user.teacher_profile
        return super().create(validated_data)



class AssignmentListSerializer(serializers.ModelSerializer):
    classroom_name = serializers.CharField(
        source="classroom.name", read_only=True
    )
    subject_name = serializers.CharField(
        source="subject.name", read_only=True
    )
    teacher_name = serializers.CharField(
        source="teacher.user.name", read_only=True
    )
    
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "classroom",
            "classroom_name",
            "subject",
            "subject_name",
            "teacher_name",
            "due_date",
            "is_active",
            "created_at",
        ]
        
    def get_is_active(self, obj):
        return obj.is_active and obj.due_date > timezone.now()



class AssignmentDetailSerializer(serializers.ModelSerializer):
    classroom_name = serializers.CharField(
        source="classroom.name", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(
        source="teacher.user.name", read_only=True)
    due_date = serializers.DateTimeField(
        format="%d %b %Y, %I:%M %p", read_only=True)
    
    class Meta:
        model = Assignment
        fields = '__all__'



class StudentAssignmentListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)
    
    is_submitted = serializers.SerializerMethodField()
    marks_obtained = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            'id',
            'title',
            'description',
            'subject',
            'subject_name',
            'classroom_name',
            'due_date',
            'is_active',
            'is_submitted',
            'marks_obtained',
        ]

    def get_is_submitted(self, obj):
        user = self.context['request'].user
        return obj.submissions.filter(student=user.student_profile).exists()

    def get_marks_obtained(self, obj):
        user = self.context['request'].user
        submission = obj.submissions.filter(student=user.student_profile).first()
        return submission.marks_obtained if submission else None
