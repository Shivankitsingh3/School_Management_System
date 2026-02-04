from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


class EmailActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.is_active}"


activation_token_generator = EmailActivationTokenGenerator()


def generate_activation_link(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = activation_token_generator.make_token(user)

    return f"{settings.FRONTEND_URL}/activate/{uid}/{token}"


def send_activation_email(user, request):
    activation_link = generate_activation_link(user, request)

    html_content = render_to_string(
        "account/activation_email.html",
        {
            "name": user.name,
            "activation_link": activation_link,
        }
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=user.email,
        subject="Activate your account",
        html_content=html_content,
    )
    
    api_key = os.getenv("SENDGRID_API_KEY")


    print("SENDGRID KEY PRESENT:", bool(api_key))

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)

        print("SENDGRID STATUS:", response.status_code)
        print("SENDGRID BODY:", response.body)

    except Exception as e:
        print("SENDGRID ERROR:", str(e))



password_reset_token_generator = PasswordResetTokenGenerator()


def generate_password_reset_link(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = password_reset_token_generator.make_token(user)

    return f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"


def send_password_reset_email(user, request):
    reset_link = generate_password_reset_link(user, request)

    html_content = render_to_string(
        "account/password_reset_email.html",
        {
            "name": user.name,
            "reset_link": reset_link,
        }
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=user.email,
        subject="Reset your password",
        html_content=html_content,
    )

    api_key = os.getenv("SENDGRID_API_KEY")


    print("SENDGRID KEY PRESENT:", bool(api_key))

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)

        print("SENDGRID STATUS:", response.status_code)
        print("SENDGRID BODY:", response.body)

    except Exception as e:
        print("SENDGRID ERROR:", str(e))
