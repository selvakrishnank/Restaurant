from rest_framework import serializers
from .models import CateringOrder

class CateringOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = CateringOrder
        fields = "__all__"