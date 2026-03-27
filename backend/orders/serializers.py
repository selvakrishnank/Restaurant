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

    items = serializers.SerializerMethodField()

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

    def get_items(self, obj):

        request = self.context.get("request")

        if request and hasattr(request, "parser_context"):
            view = request.parser_context.get("view").__class__.__name__
        else:
            view = None

        if view == "KitchenOrdersView":
            queryset = obj.items.filter(status__in=["pending", "preparing"])

        elif view == "ReadyToServeOrdersView":
            queryset = obj.items.filter(status="ready")

        elif view == "AwaitingPaymentOrdersView":
            queryset = obj.items.filter(status="served")

        else:
            queryset = obj.items.all()

        return OrderItemSerializer(queryset, many=True).data