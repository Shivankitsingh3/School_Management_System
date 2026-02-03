from django.urls import path
from . import views


urlpatterns = [
    path('me/', views.PrincipalSelfProfileView.as_view(), name='principal_me'),
    path('assign/', views.PrincipalAssignTeacherView.as_view(), name='assign_teacher'),
    path("teachers/pending/", views.PendingTeacherListView.as_view(), name='pending_teacher'),
    path('dashboard/stats/', views.PrincipalDashboardStatsView.as_view(), name='principal_dashboard_stats'),
]
