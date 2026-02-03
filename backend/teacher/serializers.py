from rest_framework import serializers
from .models import Teacher, TeacherSubject
from subject.models import Subject
from account.serializers import CustomUserProfileSerializer
from classroom.models import ClassRoom


class TeacherProfileSerializer(serializers.ModelSerializer):
    user = CustomUserProfileSerializer(read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'registration_id', 'user',
                  'preferred_subjects']
        read_only_fields = fields


class TeacherListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    expertise = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ['id', 'name', 'registration_id', 'email', 'expertise']
    
    def get_expertise(self, obj):
        values = obj.preferred_subjects or []
        
        if values and isinstance(values[0], str):
            return values
        
        from subject.models import Subject
        return list(
            Subject.objects.filter(id__in=values).values_list('name', flat=True)
        )


class TeacherSubjectSerializer(serializers.ModelSerializer):
    classroom_name = serializers.CharField(
        source='classroom.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = TeacherSubject
        fields = ['id', 'teacher', 'classroom',
                  'classroom_name', 'subject', 'subject_name']
        read_only_fields = ['classroom_name', 'subject_name']