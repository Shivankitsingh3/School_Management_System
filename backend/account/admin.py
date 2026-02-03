from django import forms
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
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


class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ("email", "name", "role", "dob", "mobile", "city")

    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("password1") != cleaned.get("password2"):
            raise forms.ValidationError("Passwords do not match")
        return cleaned

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    add_form = CustomUserCreationForm

    list_display = ("email", "name", "role", "is_staff")
    ordering = ("email",)
    search_fields = ("email", "name")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal", {"fields": ("name", "role", "dob", "mobile", "city")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "name", "role", "dob", "mobile", "city", "password1", "password2"),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAdmin)
