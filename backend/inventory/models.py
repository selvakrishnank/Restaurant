from django.db import models


class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50)
    minimum_stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)