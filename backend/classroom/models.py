from django.db import models

# Create your models here.



CLASS_GRADE_CHOICES = [
    (1, "1st"),
    (2, "2nd"),
    (3, "3rd"),
    (4, "4th"),
    (5, "5th"),
    (6, "6th"),
    (7, "7th"),
    (8, "8th"),
    (9, "9th"),
    (10, "10th"),
    (11, "11th"),
    (12, "12th"),
]


SECTION_CHOICES = [
    ("A", "A"),
    ("B", "B"),
    ("C", "C"),
]


class ClassRoom(models.Model):
    grade = models.PositiveIntegerField(choices=CLASS_GRADE_CHOICES)
    section = models.CharField(max_length=1, choices=SECTION_CHOICES)
    name = models.CharField(max_length=10, unique=True)
    
    
    def save(self, *args, **kwargs):
        self.name = f'{self.get_grade_display()}-{self.section}'
        super().save(*args, **kwargs)
    
    
    class Meta:
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'
        unique_together = ('grade', 'section')
        ordering = ['grade', 'section']
    
    def __str__(self):
        return self.name