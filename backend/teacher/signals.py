import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from teacher.models import Teacher, TeacherSubject
from principal.models import Principal
from notifications.models import Notification


logger = logging.getLogger(__name__)


@receiver(post_save, sender=Teacher)
def notify_principal_on_teacher_registration(sender, instance, created, **kwargs):
    if created:
        principals = Principal.objects.select_related('user').all()

        notifications = [
            Notification(
                user=p.user,
                title="New Teacher Registration",
                message=(
                    f"Teacher {instance.user.name} has registered. "
                    "Classroom assignment is pending."
                )
            )
            for p in principals
        ]

        if notifications:
            try:
                Notification.objects.bulk_create(notifications)
            except Exception as e:
                logger.error(
                    f"Failed to create teacher registration notifications: {e}")


@receiver(post_save, sender=TeacherSubject)
def notify_teacher_on_assignment(sender, instance, created, **kwargs):
    if created:
        try:
            Notification.objects.create(
                user=instance.teacher.user,
                title="Classroom Assignment Approved",
                message=(
                    f"You have been assigned to {instance.subject.name} in {instance.classroom.name}. "
                    "You can now create assignments and mark attendance."
                )
            )
        except Exception as e:
            logger.error(
                f"Failed to create teacher assignment notification: {e}")
