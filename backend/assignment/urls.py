from django.urls import path
from assignment.views.assignment import (
    AssignmentCreateView,
    AssignmentListView,
    AssignmentDetailView,
)
from assignment.views.submission import (
    AssignmentSubmissionCreateView,
    StudentSubmissionListView,
    TeacherAssignmentSubmissionListView,
    AssignmentSubmissionEvaluateView,
    AISuggestionView,
)

urlpatterns = [
    path("", AssignmentListView.as_view(), name="assignment-list"),
    path("create/", AssignmentCreateView.as_view(), name="assignment-create"),
    path("<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),

    path("<int:assignment_id>/submit/", AssignmentSubmissionCreateView.as_view(),
         name="assignment-submit"),
    path("my-submissions/", StudentSubmissionListView.as_view(),
         name="student-submissions"),
    path("submissions/teacher/", TeacherAssignmentSubmissionListView.as_view(),
         name="teacher-submissions"),
    path("submissions/<int:pk>/evaluate/", AssignmentSubmissionEvaluateView.as_view(),
         name="submission-evaluate"),
    path('ai-suggestion/<int:pk>/',
         AISuggestionView.as_view(), name='ai-suggestion'),
]
