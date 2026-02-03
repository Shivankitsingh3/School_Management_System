from .utils import activation_token_generator
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.generics import (
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import (
    CustomUserRegistrationSerializer,
    CustomUserLoginSerializer,
    ChangePasswordSerializer,
    CustomUserProfileSerializer,
    CustomUserUpdateSerializer,
)
from .utils import send_password_reset_email, password_reset_token_generator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import logging


logger = logging.getLogger('account')


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomUserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        try:
            from .utils import send_activation_email
            import threading
            threading.Thread(target=send_activation_email, args=(user, request)).start()
        except Exception as e:
            print(f'Email failed to send: {e}')
            
        return Response(
            {"message": "Registration successful. Please check email to activate.",
             "user_id": serializer.data.get('id'),
             "role": serializer.data.get('role')
             },
            status=status.HTTP_201_CREATED
        )


class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid activation link"}, status=400)

        if activation_token_generator.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"message": "Account activated successfully"})
        else:
            return Response({"error": "Activation link expired"}, status=400)



class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = CustomUserLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            
            if x_forwarded_for:
                user_ip = x_forwarded_for.split(',')[0]
            else:
                user_ip = request.META.get('REMOTE_ADDR')

            attempted_email = request.data.get('email', 'Unknown')
            logger.warning(f'FAILED LOGIN ATTEMPT: Email={attempted_email}, IP={user_ip}')
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "name": user.name,
                "role": user.role,
            },
            status=status.HTTP_200_OK
        )



class MeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = CustomUserProfileSerializer(request.user)
        return Response(serializer.data)



class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"email": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"message": "If this email exists, a reset link has been sent."},
                status=status.HTTP_200_OK
            )

        send_password_reset_email(user, request)

        return Response(
            {"message": "Password reset link sent to your email."},
            status=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not password or not confirm_password:
            return Response(
                {"error": "Password and confirm password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != confirm_password:
            return Response(
                {"confirm_password": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except Exception:
            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password_reset_token_generator.check_token(user, token):
            return Response(
                {"error": "Reset link expired or invalid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {"message": "Password reset successful. You can now log in."},
            status=status.HTTP_200_OK
        )



class UserProfileView(RetrieveAPIView):
    serializer_class = CustomUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserUpdateView(UpdateAPIView):
    serializer_class = CustomUserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )

