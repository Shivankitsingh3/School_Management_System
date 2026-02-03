from django.contrib import admin
from .models import Teacher, TeacherSubject


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("registration_id", "user")
    search_fields = ("registration_id", "user__email")


@admin.register(TeacherSubject)
class TeacherSubjectAdmin(admin.ModelAdmin):
    list_display = ("teacher", "subject", "classroom")
    list_filter = ("classroom", "subject")
