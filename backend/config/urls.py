from django.contrib import admin
from django.contrib.auth.decorators import user_passes_test
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

superuser_required = user_passes_test(
    lambda u: u.is_authenticated and u.is_superuser,
    login_url='/admin/login/'
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('api.urls')),

    # Schema protegido
    path(
        'api/schema/',
        superuser_required(SpectacularAPIView.as_view()),
        name='schema'
    ),

    # Swagger protegido
    path(
        'api/docs/',
        superuser_required(
            SpectacularSwaggerView.as_view(url_name='schema')
        ),
        name='swagger-ui'
    ),

    # Redoc protegido
    path(
        'api/redoc/',
        superuser_required(
            SpectacularRedocView.as_view(url_name='schema')
        ),
        name='redoc'
    ),
]