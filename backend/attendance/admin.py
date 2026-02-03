from django.contrib import admin
from .models import Attendance, AttendanceRecord
# Register your models here.


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['date', 'classroom', 'subject', 'teacher']
    list_filter = ['date', 'classroom', 'subject']
    

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['attendance', 'student', 'status', 'created_at']
    list_filter = ['status', 'attendance__date']