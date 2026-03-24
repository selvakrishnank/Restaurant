from django.db import models

class MenuItem(models.Model):

    CATEGORY_CHOICES = [
        ("Starters", "Starters"),
        ("Main", "Main"),
        ("Desserts", "Desserts"),
        ("Drinks", "Drinks"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    image = models.ImageField(
        upload_to="menu_images/",
        null=True,
        blank=True
    )

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name