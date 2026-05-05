from django.contrib import admin
from api.users.models import CustomUser, Address
from api.products.models import Category, Product, ProductImage, InstallmentOption
from api.cart.models import Cart, CartItem
from api.orders.models import Order, OrderItem
from api.promotions.models import Promotion, Coupon
from api.payments.models import Payment
from api.stock.models import StockMovement

# admin.site.register(CustomUser)
# admin.site.register(Address)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(InstallmentOption)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Promotion)
admin.site.register(Coupon)
admin.site.register(Payment)
admin.site.register(StockMovement)