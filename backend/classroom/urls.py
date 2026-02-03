from django.urls import path
from .views import ClassroomListView

urlpatterns = [
    path("", ClassroomListView.as_view(), name="classroom-list"),
]
