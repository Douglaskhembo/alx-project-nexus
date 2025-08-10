from rest_framework import serializers
from .models import Product, Category, Currency,Order, Purchase
from rest_framework.reverse import reverse
from users.models import User
from django.conf import settings
from django.db import transaction
from decimal import Decimal
from django.core.mail import EmailMessage
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import io
import qrcode

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'country_name', 'country_code', 'currency_code', 'currency_name']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    currency = CurrencySerializer(read_only=True)
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), source='currency', write_only=True
    )

    def validate_discount_amount(self, value):
        if value is None or value < 0:
            return Decimal('0.00')
        return value

    def create(self, validated_data):
        if 'discount_amount' not in validated_data or validated_data['discount_amount'] is None:
            validated_data['discount_amount'] = Decimal('0.00')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'discount_amount' in validated_data and (
                validated_data['discount_amount'] is None or validated_data['discount_amount'] < 0):
            validated_data['discount_amount'] = Decimal('0.00')
        return super().update(instance, validated_data)

    seller_name = serializers.CharField(source='seller.name', read_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tags = serializers.ListField(child=serializers.CharField(), source='tag_list', read_only=True)
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'initial_price', 'currency', 'currency_id',
            'discount_amount', 'discounted_price', 'new_price','image', 'image_url',
            'tags', 'stock', 'category', 'category_id', 'seller',
            'seller_name', 'rating', 'reviews', 'created_at'
        ]

class PurchaseSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Purchase
        fields = ['id', 'product', 'product_id', 'seller', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    purchases = PurchaseSerializer(many=True)
    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Order
        fields = [
            'id', 'order_code', 'buyer', 'payment_type', 'order_date',
            'delivery_date', 'delivery_location', 'landmark',
            'payment_status', 'delivery_status', 'total_amount', 'purchases'
        ]
        read_only_fields = ['order_code', 'order_date', 'total_amount']

    def create(self, validated_data):
        purchases_data = validated_data.pop('purchases', [])

        with transaction.atomic():
            order = Order.objects.create(**validated_data)

            total_sum = Decimal('0.00')
            for purchase_data in purchases_data:
                product = purchase_data['product']
                price = purchase_data.get('price', product.new_price)
                quantity = purchase_data.get('quantity', 1)
                total_sum += price * quantity
                Purchase.objects.create(order=order, **purchase_data)

            order.total_amount = total_sum
            order.save()

            # Generate PDF and send email
            self._send_order_email(order)

        return order

    def _send_order_email(self, order):
        buffer = io.BytesIO()

        # --- Generate QR Code in memory ---
        qr = qrcode.make(order.order_code)
        qr_buffer = io.BytesIO()
        qr.save(qr_buffer, format="PNG")
        qr_buffer.seek(0)

        # --- PDF Generation ---
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph("NexusMarket", styles['Title']))
        elements.append(Paragraph(f"Order Invoice - {order.order_code}", styles['Title']))
        elements.append(Spacer(1, 12))

        # Order Info
        elements.append(Paragraph(f"Order Code: {order.order_code}", styles['Normal']))
        elements.append(Paragraph(f"Order Date: {order.order_date.strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Paragraph(f"Delivery Location: {order.delivery_location}", styles['Normal']))
        elements.append(Paragraph(f"Landmark: {order.landmark}", styles['Normal']))
        elements.append(Spacer(1, 12))

        # QR Code image (from memory)
        elements.append(Image(qr_buffer, width=80, height=80))
        elements.append(Spacer(1, 12))

        # Table Header
        data = [["Product", "Quantity", "Price per Quantity", "Seller"]]

        # Table Rows
        for purchase in order.purchases.all():
            data.append([
                purchase.product.name,
                str(purchase.quantity),
                f"{purchase.price:.2f}",
                purchase.seller.name if purchase.seller else "N/A"
            ])

        # Totals
        data.append(["Total", "", f"{order.total_amount:.2f}"])

        # Table Styling
        table = Table(data, colWidths=[150, 80, 120, 120])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(table)

        doc.build(elements)

        # Email with PDF attachment
        pdf_value = buffer.getvalue()
        buffer.close()

        email = EmailMessage(
            subject=f"Your Order Invoice - {order.order_code}",
            body=(
                f"Dear {order.buyer.name},\n\n"
                f"Please find attached the invoice for your order {order.order_code}.\n"
                f"Delivery Location: {order.delivery_location}\n"
                f"Landmark: {order.landmark} \n\n"
                f"Regards, \n"
                f"NexusMarket Order Department"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.buyer.email],
        )
        email.attach(f"invoice_{order.order_code}.pdf", pdf_value, "application/pdf")
        email.send()

class PurchaseDetailSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='order.buyer.name', read_only=True)
    order_code = serializers.CharField(source='order.order_code', read_only=True)
    order_date = serializers.DateTimeField(source='order.order_date', read_only=True)
    order_status = serializers.CharField(source='order.delivery_status', read_only=True)
    delivery_location = serializers.CharField(source='order.delivery_location', read_only=True)
    landmark = serializers.CharField(source='order.landmark', read_only=True)
    product = serializers.CharField(source='product.name', read_only=True)
    seller_name = serializers.CharField(source='seller.name', read_only=True)

    class Meta:
        model = Purchase
        fields = [
            'id', 'buyer_name', 'order_code', 'product', 'quantity',
            'price', 'order_date', 'order_status', 'delivery_location',
            'landmark', 'seller_name',
        ]
