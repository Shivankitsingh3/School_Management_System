from django.urls import path
from .views import (
    TeacherListView,
    TeacherSelfProfileView,
    TeacherDetailView,
    TeacherAssignedClassroomsView,
    TeacherAssignedSubjectsView,
)

urlpatterns = [
    path('', TeacherListView.as_view(), name='teacher-list'),
    path('me/', TeacherSelfProfileView.as_view(), name='teacher-profile'),
    path("my-classrooms/", TeacherAssignedClassroomsView.as_view(), name="teacher-assigned-classrooms"),
    path('my-subjects/', TeacherAssignedSubjectsView.as_view(), name='teacher-assigned-subjects'),
    path('<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),
]
