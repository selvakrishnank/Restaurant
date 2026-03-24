from django.urls import path
from . import views

urlpatterns = [
    path('menu/', views.get_menu),
]