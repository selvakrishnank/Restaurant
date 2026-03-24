from django.db import models

class Table(models.Model):

    STATUS_CHOICES = [
        ("available", "Available"),
        ("occupied", "Occupied"),
        ("reserved", "Reserved"),
    ]

    ZONE_CHOICES = [
        ("indoor", "Indoor"),
        ("outdoor", "Outdoor"),
        ("bar", "Bar"),
    ]

    name = models.CharField(max_length=50)
    seats = models.IntegerField()
    zone = models.CharField(max_length=20, choices=ZONE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")

    def __str__(self):
        return self.name