from django.urls import path
from .views import InventoryListView, AddInventoryView, UpdateStockView

urlpatterns = [

    path("inventory/", InventoryListView.as_view()),

    path("inventory/add/", AddInventoryView.as_view()),

    path("inventory/update/<int:item_id>/", UpdateStockView.as_view()),

]