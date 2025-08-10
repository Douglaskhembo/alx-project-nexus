from rest_framework import generics, permissions
from .serializers import UserSerializer
from .models import User
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSeller
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework import status
import random
from django.core.cache import cache


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BuyerRegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def perform_create(self, serializer):
        serializer.save(role='BUYER')

class CreateSellerView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        serializer.save(role='SELLER')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['name'] = user.name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['email'] = self.user.email
        data['name'] = self.user.name
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SomeSellerView(APIView):
    permission_classes = [IsAuthenticated, IsSeller]

    def get(self, request):
        return Response({"message": "Welcome Seller! Only sellers can access this endpoint."})


User = get_user_model()

class PasswordResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({"detail": "Both current and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except DjangoValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        send_mail(
            subject="Your password has been changed",
            message=(
                f"Dear {user.name},\n\n"
                "Your NexusMarket account password has been successfully changed. "
                "If you did not perform this action, please contact support immediately."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class ForgotPasswordRequestView(APIView):
    permission_classes = []  # public

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "No account found with that email."}, status=status.HTTP_404_NOT_FOUND)

        otp = random.randint(100000, 999999)
        cache.set(f"forgot_password_otp_{email}", str(otp), timeout=300)  # 5 min expiry

        send_mail(
            subject="Your NexusMarket Password Reset OTP",
            message=f"Hello {user.name},\n\nYour OTP is: {otp}\nIt will expire in 5 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"detail": "OTP sent to your email."}, status=status.HTTP_200_OK)


class ForgotPasswordVerifyView(APIView):
    permission_classes = []  # public

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp, new_password]):
            return Response({"detail": "Email, OTP, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(f"forgot_password_otp_{email}")
        if cached_otp is None or cached_otp != otp:
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        cache.delete(f"forgot_password_otp_{email}")

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
