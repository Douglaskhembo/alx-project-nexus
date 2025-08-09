from django.urls import path
from .views import BuyerRegisterView, CreateSellerView, CustomTokenObtainPairView, PasswordResetView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SomeSellerView

urlpatterns = [
    path('register/', BuyerRegisterView.as_view(), name='register-buyer'),  # for buyers
    path('admin/create-seller/', CreateSellerView.as_view(), name='admin-create-seller'),  # only admin
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # custom JWT login
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('seller-only/', SomeSellerView.as_view(), name='seller-only'),# token refresh
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
]

