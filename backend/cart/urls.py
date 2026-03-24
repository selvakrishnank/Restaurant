from django.urls import path
from .views import CartView, AddToCartView, RemoveCartItemView, UpdateQuantityView

urlpatterns = [
    path("", CartView.as_view()),
    path("add/", AddToCartView.as_view()),
    path("remove/<int:item_id>/", RemoveCartItemView.as_view()),
    path("update/<int:item_id>/", UpdateQuantityView.as_view()),
]