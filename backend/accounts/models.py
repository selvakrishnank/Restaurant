from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('chef', 'Chef'),
        ('waiter', 'Waiter'),
        ('manager', 'Manager'),
        ('owner', 'Owner'),
       
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.user.username