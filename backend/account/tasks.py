from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .utils import activation_token_generator, password_reset_token_generator
import logging

logger = logging.getLogger('account')


@shared_task
def send_activation_email_task(user_id, user_name, user_email):
    try:
        from .models import CustomUser

        user = CustomUser.objects.get(pk=user_id)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = activation_token_generator.make_token(user)
        activation_link = f"{settings.FRONTEND_URL}/activate/{uid}/{token}"

        html_content = render_to_string(
            "account/activation_email.html",
            {
                "name": user_name,
                "activation_link": activation_link,
            }
        )

        email = EmailMultiAlternatives(
            subject="Activate your account",
            body="",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

        logger.info(f"Activation email sent to {user_email}")

    except Exception as e:
        logger.error(
            f"Failed to send activation email to {user_email}: {str(e)}")


@shared_task
def send_password_reset_email_task(user_id, user_name, user_email):
    try:
        from .models import CustomUser

        user = CustomUser.objects.get(pk=user_id)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = password_reset_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        html_content = render_to_string(
            "account/password_reset_email.html",
            {
                "name": user_name,
                "reset_link": reset_link,
            }
        )

        email = EmailMultiAlternatives(
            subject="Reset your password",
            body="",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

        logger.info(f"Password reset email sent to {user_email}")

    except Exception as e:
        logger.error(
            f"Failed to send password reset email to {user_email}: {str(e)}")
