python manage.py migrate --noinput

python manage.py shell << EOF
from django.contrib.auth import get_user_model
import os
from datetime import date

User = get_user_model()

email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if email and password:
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password,
            name="Admin",
            role="principal",
            dob=date(1990,1,1),
            mobile="9999999999",
            city="AdminCity"
        )
        print("Superuser created")
    else:
        print("Superuser already exists")
else:
    print("Superuser env vars not set")
EOF

gunicorn core.wsgi:application --bind 0.0.0.0:8000
