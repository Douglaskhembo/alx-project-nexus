from django.urls import path
from .views import (
    BuyerRegisterView, CreateSellerView, CustomTokenObtainPairView,
    PasswordResetView, SomeSellerView,
    ForgotPasswordRequestView, ForgotPasswordVerifyView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', BuyerRegisterView.as_view(), name='register-buyer'),
    path('admin/create-seller/', CreateSellerView.as_view(), name='admin-create-seller'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('seller-only/', SomeSellerView.as_view(), name='seller-only'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('forgot-password/', ForgotPasswordRequestView.as_view(), name='forgot-password'),
    path('forgot-password/verify/', ForgotPasswordVerifyView.as_view(), name='forgot-password-verify'),
]
