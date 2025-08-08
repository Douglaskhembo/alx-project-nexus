from django.db import models
from users.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name
class Currency(models.Model):
    country_name = models.CharField(max_length=250, unique=True)
    country_code = models.CharField(max_length=100, unique=True)
    currency_code = models.CharField(max_length=250, unique=True)
    currency_name = models.CharField(max_length=250, unique=True)

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    initial_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    new_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0.00)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True)
    stock = models.PositiveIntegerField(default=10)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    reviews = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['initial_price'])]

    def __str__(self):
        return self.name

    @property
    def tag_list(self):
        return [tag.strip() for tag in self.tags.split(",") if tag.strip()]

    def save(self, *args, **kwargs):
        self.new_price = self.initial_price - self.discount_amount
        if self.new_price < 0:
            self.new_price = 0.00
        super().save(*args, **kwargs)



class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'product'],
                name='unique_user_product',
                condition=models.Q(user__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['session_key', 'product'],
                name='unique_session_product',
                condition=models.Q(user__isnull=True)
            )
        ]




