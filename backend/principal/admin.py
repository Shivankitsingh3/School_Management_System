from django.contrib import admin
from .models import Principal
# Register your models here.


@admin.register(Principal)
class PrincipalAdmin(admin.ModelAdmin):
    list_display = ['registration_id', 'get_name', 'get_email', 'get_city']
    search_fields = ['registration_id', 'user__name', 'user__email']
    readonly_fields = ['registration_id', 'id']

    fieldsets = (
        ('Principal Information', {
            'fields': ('registration_id', 'user')
        }),
    )

    def get_name(self, obj):
        return obj.user.name
    get_name.short_description = 'Name'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def get_city(self, obj):
        return obj.user.city
    get_city.short_description = 'City'
