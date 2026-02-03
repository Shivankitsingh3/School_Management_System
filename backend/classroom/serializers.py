from rest_framework import serializers
from .models import ClassRoom


class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ["id", "name"]
