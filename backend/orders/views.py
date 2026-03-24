from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from tables.models import Table
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


# ✅ PLACE ORDER
class PlaceOrderView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        name = request.data.get("name")
        table_number = request.data.get("table_number")

        # ✅ validation
        if not table_number:
            return Response({"error": "Table number required"}, status=400)

        # ✅ get cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related("menu_item")

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        # ✅ calculate total
        subtotal = sum(
            item.menu_item.price * item.quantity
            for item in cart_items
        )

        tax = subtotal * Decimal("0.10")
        total = subtotal + tax

        # ✅ create order
        order = Order.objects.create(
            user=request.user,
            name=name,
            table_number=table_number,
            subtotal=subtotal,
            tax=tax,
            total=total,
            status="received"
        )

        # 🔥 MARK TABLE AS OCCUPIED
        try:
            table = Table.objects.get(id=table_number)
            table.status = "occupied"
            table.save()
        except Table.DoesNotExist:
            print("Table not found ❌")

        # ✅ create order items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                menu_item=item.menu_item,
                quantity=item.quantity,
                price=item.menu_item.price
            )

        # ✅ clear cart
        cart_items.delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data)


# ✅ CURRENT ORDER
class CurrentOrderView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        order = Order.objects.filter(
            user=request.user
        ).order_by("-created_at").first()

        if not order:
            return Response({"message": "No orders found"})

        serializer = OrderSerializer(order)
        return Response(serializer.data)


# ✅ ORDER HISTORY
class OrderHistoryView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ✅ KITCHEN VIEW
class KitchenOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            status__in=["received", "preparing"]
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ✅ UPDATE ORDER STATUS
class UpdateOrderStatusView(APIView):

    def patch(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        status_value = request.data.get("status")

        order.status = status_value
        order.save()

        return Response({
            "message": "Order updated",
            "status": order.status
        })


# ✅ READY ORDERS
class ReadyToServeOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            status="ready"
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# ✅ PAYMENT PENDING
class AwaitingPaymentOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            status="served"
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


# 🔥 COMPLETE PAYMENT (IMPORTANT FIX)
class CompletePaymentView(APIView):

    def patch(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        # ✅ mark order paid
        order.status = "paid"
        order.save()

        # 🔥 FREE TABLE
        try:
            table = Table.objects.get(id=order.table_number)  # ✅ FIX
            table.status = "available"
            table.save()
        except Table.DoesNotExist:
            print("Table not found ❌")

        return Response({
            "message": "Payment completed & table freed ✅",
            "status": order.status
        })


# ✅ ACTIVE TABLES
class ActiveTablesView(APIView):

    def get(self, request):

        orders = Order.objects.exclude(
            status="paid"
        ).order_by("-created_at")

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)