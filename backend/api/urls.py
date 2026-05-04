from django.urls import path
from . import views

urlpatterns = [
    # auth
    path('user/signup', views.signup),
    path('user/check-email', views.check_email),
    path('user/google', views.create_user_google),
    path('user/auth', views.login),

    # user
    path('user/me', views.me),
    path('user/change-password', views.change_password),

    # products
    path('products', views.list_products),
    path('categories', views.list_categories),

    # address
    path('addresses', views.list_addresses),
    path('addresses/create', views.create_address),
    path('addresses/<int:pk>/edit', views.edit_address),
    path('addresses/<int:pk>/delete', views.delete_address),

    # order
    path('orders/create', views.create_order),
]