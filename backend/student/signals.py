from django.db.models.signals import post_save
from django.dispatch import receiver
from student.models import Student
from notifications.models import Notification
from teacher.models import Teacher, TeacherSubject


@receiver(post_save, sender=Student)
def notify_teacher_on_new_student_registration(sender, instance, created, **kwargs):
    if not created:
        return

    student_classroom = instance.classroom

    teachers = Teacher.objects.filter(
        assigned_subjects__classroom=student_classroom
    ).select_related('user').distinct()

    if not teachers.exists():
        return

    notifications = [
        Notification(
            user=teacher.user,
            title="New Student Registration",
            message=(
                f"Student {instance.user.name} "
                f"has registered in {instance.classroom.name}. "
            )
        )
        for teacher in teachers
    ]

    Notification.objects.bulk_create(notifications)
