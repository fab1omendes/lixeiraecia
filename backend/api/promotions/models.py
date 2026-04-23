from django.db import models
from decimal import Decimal


class Promotion(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Porcentagem'),
        ('fixed', 'Valor fixo'),
    ]

    name = models.CharField(max_length=255)  # Ex: "Semana do Desconto"
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['start_date', 'end_date', 'is_active']),
        ]

    def __str__(self):
        return self.name

class ProductPromotion(models.Model):
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='product_promotions')
    promotion = models.ForeignKey('promotions.Promotion', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('product', 'promotion')



class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Porcentagem'),
        ('fixed', 'Valor fixo'),
    ]

    code = models.CharField(max_length=50, unique=True)  # ex: BLACK10
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)

    min_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # valor mínimo do carrinho
    max_uses = models.IntegerField(null=True, blank=True)  # limite total
    used_count = models.IntegerField(default=0)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)

    def is_valid(self, total):
        from django.utils import timezone
        now = timezone.now()

        if not self.is_active:
            return False, "Cupom inativo"

        if self.start_date > now or self.end_date < now:
            return False, "Cupom expirado"

        if self.max_uses and self.used_count >= self.max_uses:
            return False, "Cupom esgotado"

        if total < self.min_value:
            return False, f"Valor mínimo é {self.min_value}"

        return True, "Cupom válido"

    def apply_discount(self, total):
        if self.discount_type == 'percentage':
            return total * (Decimal(1) - (self.discount_value / Decimal(100)))
        else:
            return max(total - self.discount_value, 0)

    def __str__(self):
        return self.code