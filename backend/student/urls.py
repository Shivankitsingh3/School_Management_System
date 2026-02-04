from django.urls import path
from .views import (
    StudentListView,
    StudentSelfProfileView,
    StudentDetailView,
)
from .views_fix import reset_student_sequence


urlpatterns = [
    path(
        '',
        StudentListView.as_view(),
        name='student_list'
    ),
    path(
        'me/',
        StudentSelfProfileView.as_view(),
        name='student_me'
    ),
    path(
        '<int:pk>/',
        StudentDetailView.as_view(),
        name='student_detail'
    ),
    
    path("reset-seq/", reset_student_sequence),

]
