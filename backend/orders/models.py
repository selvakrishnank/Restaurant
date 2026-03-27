from django.db import models
from django.contrib.auth.models import User
from menu.models import MenuItem


class Order(models.Model):

    STATUS_CHOICES = [
        ("received", "Order Received"),
        ("preparing", "Being Prepared"),
        ("ready", "Ready to Serve"),
        ("served", "Served"),
        ("paid", "Payment Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100, blank=True, null=True)

    # better to keep FK later, but keeping your current structure
    table_number = models.IntegerField()

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="received"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - Table {self.table_number}"


class OrderItem(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("preparing", "Preparing"),
        ("ready", "Ready"),
        ("served", "Served"),
    ]

    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )

    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)

    quantity = models.IntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

   
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity} ({self.status})"