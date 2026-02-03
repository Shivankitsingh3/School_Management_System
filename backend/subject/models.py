from django.db import models

# Create your models here.


class Subject(models.Model):
    name = models.CharField(max_length=100)
    classroom = models.ForeignKey('classroom.Classroom', on_delete=models.CASCADE, related_name='subjects')
    
    
    class Meta:
        unique_together = ('name', 'classroom')
    
    
    def __str__(self):
        return f'{self.name} ({self.classroom})'