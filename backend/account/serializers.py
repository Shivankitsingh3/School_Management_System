from principal.models import Principal
from student.models import Student
from teacher.models import Teacher
from account.models import CustomUser
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import CustomUser


class TimestampMixin(serializers.Serializer):
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class CustomUserSerializer(TimestampMixin, serializers.ModelSerializer):
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'email', 'role', 'role_display',
            'dob', 'mobile', 'city',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'is_active', 'created_at']

    def get_role_display(self, obj):
        return obj.get_role_display()


class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    classroom = serializers.IntegerField(required=False, allow_null=True)
    preferred_subjects = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True,
        write_only=True
    )

    class Meta:
        model = CustomUser
        fields = [
            'name', 'email', 'password', 'confirm_password',
            'role', 'dob', 'mobile', 'city',
            'classroom', 'preferred_subjects'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"})

        if attrs['role'] == 'student' and not attrs.get('classroom'):
            raise serializers.ValidationError(
                {"classroom": "Students must select a classroom"})

        if attrs['role'] == 'teacher':
            preferred = attrs.get('preferred_subjects', [])
            if not preferred or len(preferred) == 0:
                raise serializers.ValidationError({
                    "preferred_subjects": "Teachers must select at least one subject they can teach"
                })

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        classroom_id = validated_data.pop('classroom', None)
        preferred_subjects = validated_data.pop('preferred_subjects', None)
        
        user = CustomUser.objects.create_user(**validated_data)
        
        
        user._classroom_id = classroom_id
        user._preferred_subjects = preferred_subjects
        
        return user



class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs



class CustomUserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        user = authenticate(
            email=attrs.get('email'),
            password=attrs.get('password')
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError(
                "Account inactive. Please verify your email."
            )

        attrs['user'] = user
        return attrs


class CustomUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'dob', 'mobile', 'city']


class CustomUserProfileSerializer(TimestampMixin, serializers.ModelSerializer):
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'email', 'role', 'role_display',
            'dob', 'mobile', 'city', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_active', 'created_at', 'updated_at']

    def get_role_display(self, obj):
        return obj.get_role_display()


class CustomUserListSerializer(serializers.ModelSerializer):
    role_display = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'name', 'email',
            'role', 'role_display',
            'city', 'is_active'
        ]
        read_only_fields = fields

    def get_role_display(self, obj):
        return obj.get_role_display()
