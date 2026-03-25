from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CateringOrder
from .serializers import CateringOrderSerializer


class CateringOrderList(APIView):

    def get(self, request):
        orders = CateringOrder.objects.all().order_by("-id")
        serializer = CateringOrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CateringOrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmOrder(APIView):

    def patch(self, request, order_id):
        try:
            order = CateringOrder.objects.get(id=order_id)
        except CateringOrder.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        order.status = "confirmed"
        order.save()

        serializer = CateringOrderSerializer(order)
        return Response(serializer.data)


class CancelOrder(APIView):

    def patch(self, request, order_id):
        try:
            order = CateringOrder.objects.get(id=order_id)
        except CateringOrder.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        order.status = "cancelled"
        order.save()

        serializer = CateringOrderSerializer(order)
        return Response(serializer.data)

class StartPrepView(APIView):
    def patch(self, request, order_id):
        order = CateringOrder.objects.get(id=order_id)
        order.status = "in_progress"
        order.save()

        return Response(CateringOrderSerializer(order).data)


class CompleteOrderView(APIView):
    def patch(self, request, order_id):
        order = CateringOrder.objects.get(id=order_id)
        order.status = "completed"
        order.save()

        return Response(CateringOrderSerializer(order).data)    