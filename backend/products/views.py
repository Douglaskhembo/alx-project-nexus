from rest_framework import viewsets, filters, permissions, generics
from .models import Product, Category, Currency, Order,Purchase
from .serializers import (ProductSerializer, CategorySerializer, CurrencySerializer,
                          OrderSerializer,PurchaseDetailSerializer)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Product, Cart
from users.models import User
from rest_framework.generics import DestroyAPIView
from django.shortcuts import get_object_or_404


class CurrencyView(viewsets.ModelViewSet):
    queryset = Currency.objects.all().order_by('currency_code')
    serializer_class = CurrencySerializer

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['category__id', 'stock']
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['initial_price', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'SELLER':
                return Product.objects.filter(seller=user).order_by('-created_at')
            if user.role == 'ADMIN':
                return Product.objects.all().order_by('-created_at')
        return Product.objects.filter(stock__gt=0).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated and user.role in ['SELLER', 'ADMIN']:
            serializer.save(seller=user)
        else:
            raise PermissionDenied("Only SELLER or ADMIN can add products.")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AddToCartView(APIView):

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        product = get_object_or_404(Product, pk=product_id)

        if request.user.is_authenticated:
            cart_item, created = Cart.objects.get_or_create(user=request.user, product=product)
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key
            cart_item, created = Cart.objects.get_or_create(session_key=session_key, product=product)

        cart_item.quantity += quantity
        cart_item.save()

        return Response({"message": f"Added {quantity} of {product.name} to cart."}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    def post(self, request):
        product_id = request.data.get("product_id")
        product = get_object_or_404(Product, pk=product_id)

        if request.user.is_authenticated:
            Cart.objects.filter(user=request.user, product=product).delete()
        else:
            session_key = request.session.session_key
            if session_key:
                Cart.objects.filter(session_key=session_key, product=product).delete()

        return Response({"message": f"Removed {product.name} from cart."}, status=status.HTTP_200_OK)


class DeleteProductView(DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def delete(self, request, *args, **kwargs):
        product = self.get_object()
        user = request.user

        if user.role == 'ADMIN' or (user.role == 'SELLER' and product.seller == user):
            return super().delete(request, *args, **kwargs)
        else:
            raise PermissionDenied("You do not have permission to delete this product.")


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-order_date')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Order.objects.all()
        return Order.objects.filter(buyer=self.request.user)

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class SellerPurchasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'ADMIN':
            purchases = Purchase.objects.select_related('order__buyer', 'product', 'seller', 'order').all()
        elif user.role == 'SELLER':
            purchases = Purchase.objects.select_related('order__buyer', 'product', 'seller', 'order').filter(seller=user)
        else:
            return Response({"detail": "Not authorized."}, status=403)

        serializer = PurchaseDetailSerializer(purchases, many=True)
        return Response(serializer.data)