from django.urls import path
from .views import *

urlpatterns = [

    path("shifts/", ShiftListView.as_view()),
    path("shifts/create/", CreateShiftView.as_view()),
    path("shifts/start/<int:shift_id>/", StartShiftView.as_view()),
    path("shifts/delete/<int:shift_id>/", DeleteShiftView.as_view()),
    path("shifts/end/<int:shift_id>/", EndShiftView.as_view()),

]