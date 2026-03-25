from django.urls import path
from .views import *

urlpatterns = [

    path("tables/", TableListView.as_view()),
    path("tables/update/<int:table_id>/", UpdateTableStatusView.as_view()),

]