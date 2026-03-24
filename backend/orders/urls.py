from django.urls import path
from .views import PlaceOrderView,CurrentOrderView, OrderHistoryView, KitchenOrdersView, UpdateOrderStatusView, ReadyToServeOrdersView, AwaitingPaymentOrdersView, CompletePaymentView, ActiveTablesView

urlpatterns = [
    path("place-order/", PlaceOrderView.as_view()),
    path("current/", CurrentOrderView.as_view()),
    path("history/", OrderHistoryView.as_view()),
    path("kitchen/orders/", KitchenOrdersView.as_view()),
    path("<int:order_id>/status/",UpdateOrderStatusView.as_view()),
    path("ready/", ReadyToServeOrdersView.as_view()),
    path("payment/", AwaitingPaymentOrdersView.as_view()),
    path("<int:order_id>/complete-payment/", CompletePaymentView.as_view()),
    path("active-tables/",ActiveTablesView.as_view()),

    
]