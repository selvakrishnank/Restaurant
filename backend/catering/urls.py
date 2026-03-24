from django.urls import path
from .views import CateringOrderList, ConfirmOrder, CancelOrder, StartPrepView, CompleteOrderView

urlpatterns = [

    path("catering/", CateringOrderList.as_view()),
    path("catering/<int:order_id>/confirm/", ConfirmOrder.as_view()),
    path("catering/<int:order_id>/cancel/", CancelOrder.as_view()),
    path("catering/<int:order_id>/start/", StartPrepView.as_view()),     # NEW
    path("catering/<int:order_id>/complete/", CompleteOrderView.as_view()),  # NEW

]