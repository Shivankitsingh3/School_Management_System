from django.db.models.signals import post_save
from django.dispatch import receiver
from .models.assignment import Assignment
from .models.submission import AssignmentSubmission
from student.models import Student
from notifications.models import Notification


@receiver(post_save, sender=Assignment)
def notify_students_new_assignment(sender, instance, created, **kwargs):
    if created:
        students = Student.objects.filter(classroom=instance.classroom).select_related('user')
        
        notifications = [
            Notification(
                user=student.user,
                title='New Assignment Posted!',
                message=f"A new assignment '{instance.title}' has been posted for {instance.subject.name}. Due date: {instance.due_date.strftime('%Y-%m-%d %H:%M')}"
            )
            for student in students
        ]
        
        Notification.objects.bulk_create(notifications)


@receiver(post_save, sender=AssignmentSubmission)
def notify_teacher_new_assignment_submission(sender, instance, created, **kwargs):
    
    if created:
        teacher_user = instance.assignment.teacher.user
        student_name = instance.student.user.name
        assignment_title = instance.assignment.title
        
        Notification.objects.create(
            user=teacher_user,
            title='New Assignment Submitted!',
            message=(
                f"Student {student_name} submitted '{assignment_title}' "
                f"at {instance.submitted_at.strftime('%Y-%m-%d %H:%M')}. "
                "Waiting for your evaluation."
            )            
        )