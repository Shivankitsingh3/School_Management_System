from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sms/account/', include('account.urls')),
    path('sms/student/', include('student.urls')),
    path('sms/teacher/', include('teacher.urls')),
    path('sms/principal/', include('principal.urls')),
    path("sms/assignments/", include("assignment.urls")),
    path("sms/attendance/", include("attendance.urls")),
    path("sms/classrooms/", include("classroom.urls")),
    path("sms/subjects/", include("subject.urls")),
    path('sms/notifications/', include('notifications.urls')),
    
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]