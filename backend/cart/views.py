from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status

from .models import Cart, CartItem
from .serializers import CartItemSerializer


class CartView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(user=request.user)

        items = cart.items.select_related("menu_item")

        serializer = CartItemSerializer(
            items,
            many=True,
            context={"request": request}
        )

        return Response({
            "items": serializer.data,
            "count": items.count()
        })


class AddToCartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        menu_item_id = request.data.get("menu_item_id")

        if not menu_item_id:
            return Response(
                {"error": "menu_item_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item_id=menu_item_id
        )

        if not created:
            cart_item.quantity += 1
            cart_item.save()

        return Response(
            {"message": "Item added"},
            status=status.HTTP_200_OK
        )


class RemoveCartItemView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        try:
            item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        item.delete()

        return Response(
            {"message": "Item removed"},
            status=status.HTTP_200_OK
        )


class UpdateQuantityView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):

        quantity = request.data.get("quantity")

        if not quantity:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        item.quantity = quantity
        item.save()

        return Response(
            {"message": "Quantity updated"},
            status=status.HTTP_200_OK
        )