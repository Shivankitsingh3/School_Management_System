from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser
from student.models import Student
from teacher.models import Teacher
from principal.models import Principal


class StudentInline(admin.StackedInline):
    model = Student
    extra = 0
    readonly_fields = ['registration_id']
    fields = ['registration_id', 'classroom']


class TeacherInline(admin.StackedInline):
    model = Teacher
    extra = 0
    readonly_fields = ['registration_id']
    fields = ['registration_id', 'preferred_subjects']


class PrincipalInline(admin.StackedInline):
    model = Principal
    extra = 0
    readonly_fields = ['registration_id']
    fields = ['registration_id']


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    ordering = ('email',)

    list_display = ['id', 'name', 'email', 'role', 'is_active']
    readonly_fields = ['id', 'created_at', 'updated_at']
    list_filter = ['role', 'is_active', 'city']
    search_fields = ['name', 'email', 'mobile']

    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'email', 'password', 'role', 'dob', 'mobile', 'city')
        }),
        ('Status', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'role', 'dob', 'mobile', 'city', 'is_active'),
            'description': 'Enter the same password in both fields.'
        }),
    )

    def get_inlines(self, request, obj=None):
        if obj:
            if obj.role == 'student':
                return [StudentInline]
            elif obj.role == 'teacher':
                return [TeacherInline]
            elif obj.role == 'principal':
                return [PrincipalInline]
        return []

    def save_model(self, request, obj, form, change):
        if not change:
            if 'password1' in form.cleaned_data:
                obj.set_password(form.cleaned_data['password1'])
        else:
            if 'password' in form.changed_data:
                obj.set_password(obj.password)

        super().save_model(request, obj, form, change)
