from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'location', 'county', 'country', 'phone_number', 'role', 'password']
        read_only_fields = ['id']

    def validate_role(self, value):
        request = self.context['request']
        if value == 'ADMIN':
            raise serializers.ValidationError("You cannot create an ADMIN user.")
        if value == 'SELLER' and not request.user.is_authenticated:
            raise serializers.ValidationError("Only ADMINs can create SELLER accounts.")
        if value == 'SELLER' and request.user.role != 'ADMIN':
            raise serializers.ValidationError("Only ADMINs can assign the SELLER role.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role  # Include role in token response
        return data
