from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import ProductViewSet, CategoryViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API Router for viewsets
router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)

schema_view = get_schema_view(
    openapi.Info(title="E-Commerce API", default_version='v1'),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API routes
    path('api/', include(router.urls)),

    # Include user-related endpoints
    path('api/users/', include('users.urls')),

    # Swagger docs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
