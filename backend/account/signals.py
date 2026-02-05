from django.db.models.signals import post_save
from django.dispatch import receiver
from account.models import CustomUser
from student.models import Student
from teacher.models import Teacher
from principal.models import Principal


@receiver(post_save, sender=CustomUser)
def create_role_profile(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.role == "student":
        Student.objects.get_or_crea(
            user=instance,
            defaults={
                "classroom_id": getattr(instance, "_classroom_id", None)
            }
        )

    elif instance.role == "teacher":
        Teacher.objects.get_or_create(
            user=instance,
            defaults={
                "preferred_subjects": getattr(instance, "_preferred_subjects", [])
            }
        )

    elif instance.role == "principal":
        Principal.objects.get_or_create(user=instance)
