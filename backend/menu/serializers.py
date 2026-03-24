from rest_framework import serializers
from .models import MenuItem

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "image",
            "is_available"   # ⭐ ADD THIS
        ]