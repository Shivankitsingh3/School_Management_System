from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('registration_id', 'user', 'classroom')
    list_filter = ('classroom',)
    search_fields = ('registration_id', 'user__email')
    readonly_fields = ('registration_id',)

    fieldsets = (
        ('User Info', {'fields': ('user',)}),
        ('Student Info', {'fields': ('classroom',)}),
        ('Auto Generated', {'fields': ('registration_id',)}),
    )
