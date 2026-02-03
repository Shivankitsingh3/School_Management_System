from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings
import threading


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

    subject = "Activate your account"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    html_content = render_to_string(
        "account/activation_email.html",
        {
            "name": user.name,
            "activation_link": activation_link,
        }
    )

    email = EmailMultiAlternatives(subject, "", from_email, to)
    email.attach_alternative(html_content, "text/html")
    email.send()


password_reset_token_generator = PasswordResetTokenGenerator()


def generate_password_reset_link(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = password_reset_token_generator.make_token(user)

    return f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"


def send_password_reset_email(user, request):
    reset_link = generate_password_reset_link(user, request)

    subject = "Reset your password"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    html_content = render_to_string(
        "account/password_reset_email.html",
        {
            "name": user.name,
            "reset_link": reset_link,
        }
    )

    def _send():
        email = EmailMultiAlternatives(subject, "", from_email, to)
        email.attach_alternative(html_content, "text/html")
        email.send()

    threading.Thread(target=_send).start()
