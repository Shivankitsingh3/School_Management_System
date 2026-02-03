from django.urls import path
from .views import SubjectListView, GlobalSubjectListView

urlpatterns = [
    path("", SubjectListView.as_view(), name="subject-list"),
    path("global/", GlobalSubjectListView.as_view(), name='global_subjects'),
]
