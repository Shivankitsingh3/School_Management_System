from django.db.models.signals import post_save
from django.dispatch import receiver
from teacher.models import Teacher, TeacherSubject
from principal.models import Principal
from notifications.models import Notification


@receiver(post_save, sender=Teacher)
def notify_principal_on_teacher_registration(sender, instance, created, **kwargs):
    if not created:
        return

    principals = Principal.objects.select_related('user')

    notifications = [
        Notification(
            user=principal.user,
            title="New Teacher Registration",
            message=(
                f"Teacher {instance.user.name} "
                f"has registered with expertise subjects. "
                f"Assignment to classroom is pending."
            )
        )
        for principal in principals
    ]

    Notification.objects.bulk_create(notifications)



@receiver(post_save, sender=TeacherSubject)
def notify_teacher_on_assignment(sender, instance, created, **kwargs):
    if not created:
        return

    teacher_user = instance.teacher.user

    Notification.objects.create(
        user=teacher_user,
        title="Classroom Assignment Approved",
        message=(
            f"You have been assigned to teach "
            f"{instance.subject.name} in "
            f"{instance.classroom.name}. "
            "You can now create assignments and mark attendance."
        )
    )
