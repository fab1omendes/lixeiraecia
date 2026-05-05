from django.urls import path
from . import views
from .products import views as products_views

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
    path('products', products_views.list_products),
    path('products/<int:pk>', products_views.product_detail),
    path('categories', products_views.list_categories),
    path('categories/<int:pk>', products_views.category_detail),

    # address
    path('addresses', views.list_addresses),
    path('addresses/create', views.create_address),
    path('addresses/<int:pk>/edit', views.edit_address),
    path('addresses/<int:pk>/delete', views.delete_address),

    # order
    path('orders/create', views.create_order),

    # admin
    path('admin/stats', views.dashboard_stats),
    path('admin/orders', views.list_orders),
    path('admin/orders/<int:pk>/status', views.update_order_status),
    path('admin/users', views.list_users_admin),
    path('admin/users/<int:pk>/status', views.update_user_status_admin),
    path('admin/promotions', views.list_create_promotions),
    path('admin/promotions/<int:pk>', views.delete_promotion),
    path('admin/coupons', views.list_create_coupons),
]