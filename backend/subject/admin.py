from django.contrib import admin
from .models import Subject
# Register your models here.



@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'classroom')
    list_filter = ('classroom__grade', 'classroom')
    search_fields = ('name',)