from django.db import models
from teacher.models import Teacher


class Assignment(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )
    classroom = models.ForeignKey(
        'classroom.Classroom',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    subject = models.ForeignKey(
        'subject.Subject',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    max_marks = models.PositiveIntegerField()
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        verbose_name = "Assignment"
        verbose_name_plural = "Assignments"
        ordering = ["-created_at"]
        
        
    def __str__(self):
        return f"{self.title} ({self.subject})"
    