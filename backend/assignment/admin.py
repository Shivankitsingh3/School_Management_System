from django.contrib import admin
from assignment.models import Assignment, AssignmentSubmission
# Register your models here.



@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['id','title', 'subject', 'teacher', 'due_date', 'max_marks', 'is_active', 'created_at']
    
    list_filter = ['subject', 'is_active', 'due_date']
    search_fields = ['title', 'subject', 'teacher__email']
    ordering = ['-created_at',]
    readonly_fields = ['teacher', 'created_at', 'updated_at']
    
    def has_change_permission(self, request, obj = None):
        return True
    


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'assignment', 'student', 'submitted_at', 'marks_obtained']
    list_filter = ['submitted_at']
    search_fields = ['student__email', 'assignment__title']
    ordering = ['-submitted_at']
    readonly_fields = ['student', 'assignment', 'submitted_at']