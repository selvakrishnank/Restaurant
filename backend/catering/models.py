from django.db import models


class CateringOrder(models.Model):

    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("confirmed", "Confirmed"),
    ("in_progress", "In Progress"),
    ("completed", "Completed"),
]

    EVENT_TYPE = [
        ("corporate", "Corporate"),
        ("wedding", "Wedding"),
        ("party", "Party"),
    ]

    # BASIC INFO (React form)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    # EVENT INFO
    event_type = models.CharField(
        max_length=50,
        choices=EVENT_TYPE,
        default="corporate"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # DATE & TIME (split for React compatibility)
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)

    guests = models.IntegerField()

    # LOCATION
    venue = models.CharField(max_length=255)

    # EXTRA INFO
    requests = models.TextField(blank=True)

    # OPTIONAL MENU (from manager side)
    menu_items = models.JSONField(blank=True, null=True)

    # PRICE (auto calculated)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # AUTO CALCULATE PRICE
    def save(self, *args, **kwargs):
        self.price = self.guests * 30
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.event_type}"