from django.urls import path
from .views import (
    DashboardStatsView,
    RecentOrdersView,
    MenuListView,
    ToggleMenuItemView,
    DeleteMenuItemView,
    UpdateMenuItemView,
    CreateMenuItemView
    
)

urlpatterns = [

    path("stats/", DashboardStatsView.as_view()),
    path("recent-orders/", RecentOrdersView.as_view()),
    path("menu/", MenuListView.as_view()),
    path("menu/<int:item_id>/toggle/", ToggleMenuItemView.as_view()),
    path("menu/<int:item_id>/delete/", DeleteMenuItemView.as_view()),
    path("menu/update/<int:pk>/", UpdateMenuItemView.as_view()),
    path("menu/create/", CreateMenuItemView.as_view()),

    

]