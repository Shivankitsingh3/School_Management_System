from django.db import models
from account.models import CustomUser


class Principal(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='principal_profile')
    registration_id = models.CharField(
        max_length=15, unique=True, editable=False, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.registration_id:
            if self.pk:
                self.registration_id = f'HOS{self.pk:04d}'
            else:
                super().save(*args, **kwargs)
                self.registration_id = f'HOS{self.pk:04d}'
                super().save(update_fields=['registration_id'])
                return

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.name} {self.user.email} ({self.registration_id})'

    class Meta:
        verbose_name = 'Principal'
        verbose_name_plural = 'Principals'
        ordering = ['registration_id']
        db_table = 'principals'
        indexes = [
            models.Index(fields=['registration_id'])
        ]
