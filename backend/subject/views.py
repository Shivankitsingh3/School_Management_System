from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer
from rest_framework.permissions import AllowAny


class SubjectListView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Subject.objects.select_related("classroom")
        classroom_id = self.request.query_params.get("classroom")
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)
        return queryset


class GlobalSubjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        distinct_names = (
            Subject.objects
            .values_list('name', flat=True)
            .distinct()
            .order_by('name')
        )

        unique_subjects = []
        for name in distinct_names:
            subject = Subject.objects.filter(name=name).first()
            if subject:
                unique_subjects.append({
                    'id': subject.id,
                    'name': subject.name
                })

        return Response(unique_subjects)
