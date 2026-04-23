from django.db import models
from decimal import Decimal
from api.users.models import CustomUser
from api.products.models import Product

#Carrinho
class Cart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='cart')
    #Cupom
    coupon = models.ForeignKey('promotions.Coupon', null=True, blank=True, on_delete=models.SET_NULL)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_total(self):
        from decimal import Decimal

        items = self.items.select_related('product').prefetch_related(
            'product__product_promotions__promotion'
        )

        total = Decimal('0.00')

        for item in items:
            price = item.product.get_price()
            total += price * item.quantity

        coupon_message = None

        if self.coupon:
            is_valid, message = self.coupon.is_valid(total)

            if is_valid:
                total = self.coupon.apply_discount(total)
            else:
                coupon_message = message

        return {
            "total": max(total, Decimal('0.00')),
            "coupon_message": coupon_message
        }
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_cart_product')
        ]

    
    def save(self, *args, **kwargs):
        if self.quantity > self.product.stock:
            raise ValueError("Quantidade maior que o estoque disponível")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
