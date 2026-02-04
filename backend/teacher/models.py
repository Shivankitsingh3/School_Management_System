from django.db import models
from account.models import CustomUser


class Teacher(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='teacher_profile')
    registration_id = models.CharField(
        max_length=15, unique=True, editable=False)
    preferred_subjects = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and not self.registration_id:
            self.registration_id = f'FAC{self.id:04d}'
            Teacher.objects.filter(pk=self.pk).update(
                registration_id=self.registration_id)

    def __str__(self):
        return f'{self.registration_id} | {self.user.name} ({self.user.email})'

    class Meta:
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'
        ordering = ['registration_id']
        db_table = 'teachers'
        indexes = [
            models.Index(fields=['registration_id'])
        ]



class TeacherSubject(models.Model):
    teacher = models.ForeignKey(
        'teacher.Teacher',
        on_delete=models.CASCADE,
        related_name='assigned_subjects'
    )
    classroom = models.ForeignKey(
        'classroom.ClassRoom',
        on_delete=models.CASCADE,
        related_name='teacher_assignments'
    )
    subject = models.ForeignKey(
        'subject.Subject',
        on_delete=models.CASCADE,
        related_name='teacher_subjects'
    )

    class Meta:
        unique_together = ('classroom', 'subject')

    def __str__(self):
        return f'{self.teacher.user.name} | {self.subject.name} | {self.classroom.name}'
