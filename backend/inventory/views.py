from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InventoryItem
from .serializers import InventorySerializer


class InventoryListView(APIView):

    def get(self, request):

        items = InventoryItem.objects.all()

        serializer = InventorySerializer(items, many=True)

        return Response(serializer.data)


class AddInventoryView(APIView):

    def post(self, request):

        serializer = InventorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)


class UpdateStockView(APIView):

    def patch(self, request, item_id):

        change = int(request.data.get("change", 0))

        item = InventoryItem.objects.get(id=item_id)

        item.quantity = item.quantity + change

        if item.quantity < 0:
            item.quantity = 0

        item.save()

        serializer = InventorySerializer(item)

        return Response(serializer.data)