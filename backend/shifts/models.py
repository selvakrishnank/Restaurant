from django.db import models

class Shift(models.Model):

    ROLE_CHOICES = [
        ("waiter", "Waiter"),
        ("chef", "Chef"),
        ("manager", "Manager")
    ]

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("active", "Active"),
        ("missed", "Missed"),
        ("completed", "Completed")
    ]

    employee_name = models.CharField(max_length=100)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_minutes = models.IntegerField(default=60)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="scheduled"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.employee_name