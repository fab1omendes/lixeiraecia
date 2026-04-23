from django.db import models
from django.utils import timezone
from decimal import Decimal
    
# Categoria
class Category(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

# Produto
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_price(self):
        from django.utils import timezone
        now = timezone.now()

        promos = [
            pp for pp in self.product_promotions.all()
            if pp.promotion.is_active
            and pp.promotion.start_date <= now
            and pp.promotion.end_date >= now
        ]

        best_price = self.price

        for promo in promos:
            p = promo.promotion

            if p.discount_type == 'percentage':
                new_price = self.price * (Decimal(1) - (p.discount_value / Decimal(100)))
            else:
                new_price = self.price - p.discount_value

            if new_price < best_price:
                best_price = new_price

        return max(best_price, Decimal('0.00'))

    def get_installment_price(self, installments):
        price = self.get_price()

        option = self.installments.filter(installments=installments).first()

        if not option:
            return None

        if option.interest_rate > 0:
            total = price * (Decimal(1) + (option.interest_rate / Decimal(100)))
        else:
            total = price

        return total / installments

    def __str__(self):
        return self.name

#Imagens do produto
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Imagem do produto {self.product.name}"



class InstallmentOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='installments')
    installments = models.IntegerField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # %

    def __str__(self):
        return f"{self.installments}x - {self.product.name}"