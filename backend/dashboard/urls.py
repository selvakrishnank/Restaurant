from django.urls import path
from .views import OwnerDashboardView

urlpatterns = [
    path("dashboard/", OwnerDashboardView.as_view()),
]