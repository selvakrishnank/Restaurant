from django.urls import path
from .views import *

urlpatterns = [
    path('reservations/', ReservationCreateView.as_view(), name='reservations'),
    path("reserved/", ReservedTablesListView.as_view()),
    path("cancel/<int:reservation_id>/", CancelReservationView.as_view()),
]