from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="menu_item.name")
    price = serializers.FloatField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "name",
            "quantity",
            "price",
            "total_price"
        ]

    def get_total_price(self, obj):
        return obj.price * obj.quantity
    
class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "table_number",
            "status",
            "total",
            "items",
            "created_at"
        ]