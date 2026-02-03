from rest_framework import serializers
from .models import Principal
from classroom.models import ClassRoom
from subject.models import Subject
from account.serializers import CustomUserProfileSerializer
from teacher.models import Teacher, TeacherSubject


class PrincipalProfileSerializer(serializers.ModelSerializer):

    user = CustomUserProfileSerializer(read_only=True)

    class Meta:
        model = Principal
        fields = ['registration_id', 'user']
        read_only_fields = fields


class PrincipalListSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Principal
        fields = ['registration_id']
        read_only_fields = fields


class AssignTeacherSerializer(serializers.Serializer):
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all())
    classroom = serializers.PrimaryKeyRelatedField(
        queryset=ClassRoom.objects.all())
    subject = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all())

    def validate(self, data):
        subject = data['subject']
        classroom = data['classroom']
        teacher = data['teacher']

        if subject.classroom != classroom:
            raise serializers.ValidationError(
                "Subject does not belong to the selected classroom."
            )

        if TeacherSubject.objects.filter(
            subject=subject,
            classroom=classroom
        ).exists():
            existing_assignment = TeacherSubject.objects.get(
                subject=subject,
                classroom=classroom
            )
            raise serializers.ValidationError(
                f"{subject.name} in {classroom.name} is already assigned to {existing_assignment.teacher.user.name}. "
                f"Please remove the existing assignment first."
            )

        return data

    def create(self, validated_data):
        return TeacherSubject.objects.create(**validated_data)
