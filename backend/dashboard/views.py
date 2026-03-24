from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, F
from orders.models import Order, OrderItem
from menu.models import MenuItem
from django.db.models import Count
from shifts.models import Shift   # create this model


class OwnerDashboardView(APIView):

    def get(self, request):

        # 🔹 Total Revenue
        total_revenue = Order.objects.filter(
            status="paid"
        ).aggregate(total_sum=Sum("total"))["total_sum"]

        # 🔹 Total Orders
        total_orders = Order.objects.count()

        # 🔹 Avg Order Value
        avg_order = Order.objects.aggregate(avg=Avg("total"))["avg"]

        # 🔹 Staff Count
        staff_count = Shift.objects.count()

        # 🔹 Order Status
        status_data = Order.objects.values("status").annotate(
            count=Count("id")
        )

        # 🔹 Revenue by Category
        category_data = OrderItem.objects.values(
            "menu_item__category"
        ).annotate(
            total=Sum("price")
        )

        # 🔹 Top Selling Items

        top_items = OrderItem.objects.values(
            "menu_item__name"
        ).annotate(
            total_sold=Sum("quantity"),
            revenue=Sum(F("price") * F("quantity"))   # ✅ FIX
        ).order_by("-total_sold")[:5]

        # 🔹 Staff Overview
        staff = Shift.objects.all().values(
            "employee_name", "role", "status"
        )


        menu_counts = MenuItem.objects.values("category").annotate(
            count=Count("id")
            
        )
        counts = {
    "starters": 0,
    "main": 0,
    "desserts": 0,
    "drinks": 0
}

        for item in menu_counts:
            cat = item["category"].lower()

            if cat == "starters":
                counts["starters"] = item["count"]
            elif cat == "main":
                counts["main"] = item["count"]
            elif cat == "desserts":
                counts["desserts"] = item["count"]
            elif cat == "drinks":
                counts["drinks"] = item["count"]

        return Response({
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "avg_order_value": avg_order,
            "staff_count": staff_count,
            "order_status": list(status_data),
            "category_revenue": list(category_data),
            "top_items": list(top_items),
            "staff": list(staff),
            "menu_counts": counts
        })