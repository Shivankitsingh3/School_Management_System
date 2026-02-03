from django.contrib import admin
from .models import ClassRoom
# Register your models here.


@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'section')
    list_filter = ('grade', 'section')
    readonly_fields = ('name',)
