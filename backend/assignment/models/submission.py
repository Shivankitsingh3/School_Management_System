from django.db import models
from storages.backends.s3boto3 import S3Boto3Storage


class AssignmentSubmission(models.Model):
    s3_storage = S3Boto3Storage()
    
    assignment = models.ForeignKey(
        'assignment.Assignment',
        on_delete= models.CASCADE,
        related_name="submissions"
    )
    student = models.ForeignKey(
        'student.Student',
        on_delete=models.CASCADE,
        related_name="assignment_submissions"
    )
    
    answer_text = models.TextField(blank=True)
    answer_file = models.FileField(
        upload_to="assignments/submissions/",
        storage=s3_storage,
        blank=True,
        null=True
    )
    
    marks_obtained = models.PositiveIntegerField(
        blank=True,
        null=True
    )
    teacher_feedback = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    evaluated_at = models.DateTimeField(blank=True, null=True)
    
    
    class Meta:
        unique_together = ("assignment", "student")
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['assignment']),
        ]
        
    
    def __str__(self):
        return f"{self.student.user.name} - {self.assignment.title}"