from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView

urlpatterns = [
    # Register new user
    path('register/', RegisterView.as_view(), name='register'),

    # JWT Login (returns access, refresh, role, email, username)
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),

    # Refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]