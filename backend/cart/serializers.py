from rest_framework import serializers
from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="menu_item.name", read_only=True)
    price = serializers.FloatField(source="menu_item.price", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "name", "price", "image", "quantity"]

    def get_image(self, obj):
        request = self.context.get("request")

        if not obj.menu_item or not obj.menu_item.image:
            return None

        return request.build_absolute_uri(obj.menu_item.image.url)