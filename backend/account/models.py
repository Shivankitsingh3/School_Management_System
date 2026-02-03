from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, name, email, password, role, dob, mobile, city, **extra_fields):

        if not email:
            raise ValueError("The email field must be set")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role,
            dob=dob,
            mobile=mobile,
            city=city,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password, role, dob, mobile, city, **extra_fields):

        extra_fields['is_active'] = True
        extra_fields['is_staff'] = True
        extra_fields['is_superuser'] = True

        return self.create_user(name, email, password, role, dob, mobile, city, **extra_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('principal', 'Principal'),
    ]

    name = models.CharField(max_length=70)
    email = models.EmailField(unique=True)
    role = models.CharField(choices=ROLE_CHOICES, max_length=15)
    dob = models.DateField()
    mobile = models.CharField(max_length=15, unique=True)
    city = models.CharField(max_length=70)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role', 'dob', 'mobile', 'city']

    objects = CustomUserManager()

    def __str__(self):
        return f'{self.name} - {self.email} - {self.role}'

    def get_absolute_url(self):
        return reverse("model_detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        if self.password and not any(
            self.password.startswith(prefix)
            for prefix in ['pbkdf2_sha256$', 'argon2$', 'bcrypt$', 'scrypt$', 'crypt$']
        ):
            self.set_password(self.password)

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['id']
        db_table = 'sms_users'
        indexes = [
            models.Index(fields=['email']),
        ]
