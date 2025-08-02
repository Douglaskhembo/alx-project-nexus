from rest_framework import serializers
from .models import Product, Category
from users.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    seller_name = serializers.CharField(source='seller.name', read_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tags = serializers.ListField(child=serializers.CharField(), source='tag_list', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'discount_percent', 'discounted_price',
            'image', 'tags', 'stock', 'category', 'category_id', 'seller', 'seller_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'seller']
