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
        student, _ = Student.objects.get_or_create(user=instance)

        classroom_id = getattr(instance, "_classroom_id", None)

    if classroom_id and not student.classroom_id:
        student.classroom_id = classroom_id
        student.save(update_fields=["classroom"])


    elif instance.role == "teacher":
        teacher, _ = Teacher.objects.get_or_create(user=instance)

        subjects = getattr(instance, "_preferred_subjects", [])

        if subjects and not teacher.preferred_subjects:
            teacher.preferred_subjects = subjects
            teacher.save(update_fields=["preferred_subjects"])


    elif instance.role == "principal":
        Principal.objects.get_or_create(user=instance)
