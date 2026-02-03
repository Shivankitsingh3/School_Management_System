from rest_framework import serializers
from .models import Subject


class SubjectSerializer(serializers.ModelSerializer):
    classroom_name = serializers.CharField(
        source="classroom.name", read_only=True
    )
    classroom_id = serializers.IntegerField(source="classroom.id", read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "classroom", "classroom_name", "classroom_id"]
