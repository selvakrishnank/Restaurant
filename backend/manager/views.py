from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order
from rest_framework import status
from menu.models import MenuItem
from django.db.models import Sum, Avg
from menu.serializers import MenuSerializer



class DashboardStatsView(APIView):

    def get(self, request):

        total_orders = Order.objects.filter(status="paid").count()

        revenue = Order.objects.filter(
            status="paid"
        ).aggregate(Sum("total"))["total__sum"] or 0

        avg_order = Order.objects.filter(
            status="paid"
        ).aggregate(Avg("total"))["total__avg"] or 0

        menu_items = MenuItem.objects.count()

        return Response({
            "total_orders": total_orders,
            "total_revenue": revenue,
            "avg_order_value": avg_order,
            "menu_items": menu_items
        })

class RecentOrdersView(APIView):

    def get(self, request):

        orders = Order.objects.filter(
            status="paid"
        ).order_by("-created_at")[:5]

        data = []

        for order in orders:
            data.append({
                "id": order.id,
                "table_number": order.table_number,
                "items_count": order.items.count(),
                "total": order.total
            })

        return Response(data)




class MenuListView(APIView):

    def get(self, request):

        items = MenuItem.objects.all()

        serializer = MenuSerializer(items, many=True,context={"request": request})

        return Response(serializer.data)            
    
class ToggleMenuItemView(APIView):

    def patch(self, request, item_id):

        try:
            item = MenuItem.objects.get(id=item_id)

        except MenuItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.is_available = not item.is_available
        item.save()

        return Response({
            "message": "Item availability updated",
            "is_available": item.is_available
        })

class DeleteMenuItemView(APIView):

    def delete(self, request, item_id):

        try:
            item = MenuItem.objects.get(id=item_id)

        except MenuItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.delete()

        return Response({
            "message": "Item deleted"
        })              
    
class UpdateMenuItemView(APIView):

    def patch(self, request, pk):

        item = MenuItem.objects.get(id=pk)

        serializer = MenuSerializer(
            item,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)
    

class CreateMenuItemView(APIView):

    def post(self, request):

        serializer = MenuSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)