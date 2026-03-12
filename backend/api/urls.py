from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 1. Login Endpoint
    # App sends username/password to this, gets tokens back
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # 2. Refresh Token Endpoint
    # App sends a 'refresh' token, gets a new 'access' token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 3. Our Custom Wallet Data Endpoint
    path('api/wallet/', views.WalletDataView.as_view(), name='wallet_data'),
    path('api/pay/', views.PaymentView.as_view(), name='pay'),
]