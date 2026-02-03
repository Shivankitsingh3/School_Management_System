from rest_framework.generics import ListAPIView
from .models import ClassRoom
from .serializers import ClassroomSerializer
from rest_framework.permissions import AllowAny


class ClassroomListView(ListAPIView):
    queryset = ClassRoom.objects.all().order_by("grade", "section")
    serializer_class = ClassroomSerializer
    permission_classes = [AllowAny]
