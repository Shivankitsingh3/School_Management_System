from student.models import Student
from teacher.models import Teacher
from subject.models import Subject
from classroom.models import ClassRoom
from django.utils import timezone
from django.db import models



class Attendance(models.Model):
    date = models.DateField(default=timezone.now)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('date', 'classroom', 'subject')
        ordering = ['-date']

    def __str__(self):
        return f'{self.subject} - {self.classroom} - {self.date}'


class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Leave'),
    )

    attendance = models.ForeignKey(
        Attendance,
        on_delete=models.CASCADE,
        related_name='records'
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('attendance', 'student')
        ordering = ['student__user__name']

    def __str__(self):
        return f'{self.student} - {self.attendance.date} - {self.status}'

