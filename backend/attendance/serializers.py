from rest_framework import serializers
from .models import Attendance, AttendanceRecord
from django.utils import timezone
from django.db import transaction
from teacher.models import TeacherSubject
from student.models import Student


class AttendanceRecordInputSerializer(serializers.Serializer):
    student = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        help_text="Student ID"
    )
    status = serializers.CharField(
        max_length=1,
        help_text="Status: P (Present), A (Absent), L (Leave)"
    )

    def validate_status(self, value):
        valid_statuses = ['P', 'A', 'L']
        if value not in valid_statuses:
            raise serializers.ValidationError(
                f"Status must be one of {valid_statuses}. Got: {value}"
            )
        return value


class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    classroom = serializers.IntegerField()
    subject = serializers.IntegerField()
    records = AttendanceRecordInputSerializer(many=True)

    def validate(self, attrs):
        teacher = self.context['request'].user.teacher_profile
        subject_id = attrs['subject']
        classroom_id = attrs['classroom']
        date = attrs['date']

        if date > timezone.now().date():
            raise serializers.ValidationError(
                {'date': 'Cannot mark attendance for future dates.'}
            )

        if not TeacherSubject.objects.filter(
            teacher=teacher,
            subject_id=subject_id,
            classroom_id=classroom_id
        ).exists():
            raise serializers.ValidationError(
                {'subject': 'You are not assigned to teach this subject in this classroom.'}
            )

        if not attrs.get('records') or len(attrs['records']) == 0:
            raise serializers.ValidationError(
                {'records': 'At least one attendance record is required.'}
            )

        for record in attrs['records']:
            student = record['student']
            if student.classroom_id != classroom_id:
                raise serializers.ValidationError(
                    {'records': f'Student {student.user.name} does not belong to this classroom.'}
                )

        return attrs

    def create(self, validated_data):
        records_data = validated_data.pop('records')
        teacher = self.context['request'].user.teacher_profile

        with transaction.atomic():
            attendance, created = Attendance.objects.get_or_create(
                date=validated_data['date'],
                classroom_id=validated_data['classroom'],
                subject_id=validated_data['subject'],
                defaults={'teacher': teacher}
            )

            if not created and attendance.teacher != teacher:
                attendance.teacher = teacher
                attendance.save()

            AttendanceRecord.objects.filter(attendance=attendance).delete()

            attendance_records = [
                AttendanceRecord(
                    attendance=attendance,
                    student=record['student'],
                    status=record['status']
                )
                for record in records_data
            ]

            AttendanceRecord.objects.bulk_create(attendance_records)

        return attendance

    def to_representation(self, instance):
        return {
            'success': True,
            'message': 'Attendance marked successfully',
            'attendance_id': instance.id,
            'date': str(instance.date),
            'classroom': instance.classroom_id,
            'subject': instance.subject_id,
            'total_records': instance.records.count()
        }



class AttendanceRecordDetailSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.name', read_only=True)
    student_email = serializers.CharField(
        source='student.user.email', read_only=True)
    student_registration_id = serializers.CharField(
        source='student.registration_id', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id',
            'student',
            'student_name',
            'student_email',
            'student_registration_id',
            'status',
            'status_display',
            'created_at'
        ]



class StudentAttendanceListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source='attendance.subject.name', read_only=True)
    date = serializers.DateField(source='attendance.date', read_only=True)
    teacher_name = serializers.CharField(
        source='attendance.teacher.user.name', read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id',
            'date',
            'subject_name',
            'status',
            'status_display',
            'teacher_name',
            'created_at'
        ]
        read_only_fields = fields



class AttendanceDetailSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(
        source='teacher.user.name', read_only=True)
    classroom_name = serializers.CharField(
        source='classroom.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    records = AttendanceRecordDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id',
            'date',
            'classroom',
            'classroom_name',
            'subject',
            'subject_name',
            'teacher',
            'teacher_name',
            'records'
        ]
        read_only_fields = fields
