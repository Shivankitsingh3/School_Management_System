from rest_framework import serializers
from .models import Student


class StudentListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    classroom_name = serializers.CharField(
        source='classroom.name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id',
            'user_id',
            'registration_id',
            'name',
            'email',
            'classroom',
            'classroom_name',
        ]
        read_only_fields = fields


class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    classroom_name = serializers.CharField(
        source='classroom.name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id',
            'user',
            'registration_id',
            'classroom',
            'classroom_name',
        ]
        read_only_fields = fields

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'name': obj.user.name,
            'email': obj.user.email,
            'role': obj.user.role,
            'dob': obj.user.dob,
            'city': obj.user.city,
            'mobile': obj.user.mobile
        }
