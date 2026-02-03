python manage.py migrate --noinput

# Create superuser if not exists (non-interactive)
python manage.py shell << EOF
from django.contrib.auth import get_user_model
import os

User = get_user_model()

email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
name = os.environ.get("DJANGO_SUPERUSER_NAME", "Admin")

if email and password:
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(email=email, password=password)
        print("Superuser created")
    else:
        print("Superuser already exists")
else:
    print("Superuser env vars not set")
EOF

gunicorn core.wsgi:application --bind 0.0.0.0:8000
