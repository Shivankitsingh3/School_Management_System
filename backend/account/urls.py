from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    
    
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate-account'),
    path("me/", views.MeView.as_view(), name="me"),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('reset-password/<uidb64>/<token>/', views.ResetPasswordView.as_view(), name='reset-password'),
]
