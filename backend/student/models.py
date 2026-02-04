from django.db import models
from account.models import CustomUser


class Student(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    registration_id = models.CharField(
        unique=True, max_length=15, blank=True, default='')
    classroom = models.ForeignKey(
        'classroom.ClassRoom',
        on_delete=models.SET_NULL,
        null=True,
        related_name='students'
    )

    def save(self, *args, **kwargs):
        if not self.registration_id or self.registration_id.strip() == '':
            if not self.pk:
                super().save(*args, **kwargs)

            self.registration_id = f'STU{self.pk:04d}'

        super().save(*args, **kwargs)

    def __str__(self):
        classroom = self.classroom.name if self.classroom else 'No Class'
        return f"{self.user.name} ({self.registration_id} - {classroom})"

    class Meta:
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['registration_id']
        db_table = 'students'
        indexes = [
            models.Index(fields=['registration_id']),
            models.Index(fields=['classroom']),
        ]
