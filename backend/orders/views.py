from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from tables.models import Table
from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


class PlaceOrderView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        name = request.data.get("name")
        table_number = request.data.get("table_number")

        if not table_number:
            return Response({"error": "Table number required"}, status=400)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related("menu_item")

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        subtotal = sum(
            item.menu_item.price * item.quantity
            for item in cart_items
        )

        tax = subtotal * Decimal("0.10")
        total = subtotal + tax

        existing_order = Order.objects.filter(
            table_number=table_number,
            status__in=["received", "preparing", "ready", "served"]
        ).first()

        if existing_order:
            order = existing_order

            if order.status in ["served", "ready"]:
                order.status = "received"

            order.subtotal += subtotal
            order.tax += tax
            order.total += total
            order.save()

        else:
            order = Order.objects.create(
                user=request.user,
                name=name,
                table_number=table_number,
                subtotal=subtotal,
                tax=tax,
                total=total,
                status="received"
            )

            try:
                table = Table.objects.get(id=table_number)
                table.status = "occupied"
                table.save()
            except Table.DoesNotExist:
                pass

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                menu_item=item.menu_item,
                quantity=item.quantity,
                price=item.menu_item.price,
                status="pending"
            )

        cart_items.delete()

        return Response(OrderSerializer(order).data)


class CurrentOrderView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        order = Order.objects.filter(
            user=request.user
        ).order_by("-created_at").first()

        if not order:
            return Response({"message": "No orders found"})

        return Response(OrderSerializer(order).data)


class OrderHistoryView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        return Response(OrderSerializer(orders, many=True).data)


class KitchenOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            items__status__in=["pending", "preparing"]  
        ).exclude(
            status="paid"   
        ).distinct().order_by("-created_at")

        serializer = OrderSerializer(orders,many=True,context={"request": request})
        return Response(serializer.data)



class UpdateOrderStatusView(APIView):

    def patch(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        status_value = request.data.get("status")

        order.status = status_value
        order.save()

        if status_value == "preparing":
            OrderItem.objects.filter(
                order=order,
                status="pending"
            ).update(status="preparing")

        elif status_value == "ready":
            OrderItem.objects.filter(
                order=order,
                status="preparing"
            ).update(status="ready")

        elif status_value == "served":
            OrderItem.objects.filter(
                order=order,
                status="ready"
            ).update(status="served")

        return Response({
            "message": "Order & items updated",
            "status": order.status
        })


class ReadyToServeOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            items__status="ready"
        ).distinct().order_by("-created_at")

        return Response(OrderSerializer(orders, many=True, context={"request": request}).data)


class AwaitingPaymentOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            status="served"
        ).order_by("-created_at")

        return Response(OrderSerializer(orders, many=True, context={"request": request}).data)


class CompletePaymentView(APIView):

    def patch(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        order.status = "paid"
        order.save()

        OrderItem.objects.filter(order=order).update(status="served")

        try:
            table = Table.objects.get(id=order.table_number)
            table.status = "available"
            table.save()
        except Table.DoesNotExist:
            pass

        return Response({
            "message": "Payment completed & table freed",
            "status": order.status
        })


class ActiveTablesView(APIView):

    def get(self, request):

        orders = Order.objects.exclude(
            status="paid"
        ).order_by("-created_at")

        return Response(OrderSerializer(orders, many=True).data)