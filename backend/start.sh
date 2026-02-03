python manage.py makemigrations account
python manage.py migrate account

python manage.py makemigrations
python manage.py migrate --noinput

gunicorn core.wsgi:application --bind 0.0.0.0:8000