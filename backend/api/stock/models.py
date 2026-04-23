from django.db import models
from api.products.models import Product

#  Controle de estoque
class StockMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('in', 'Entrada'),
        ('out', 'Saída'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    quantity = models.IntegerField(default=0)
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPE_CHOICES, default='in')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.movement_type == 'out':
            if self.product.stock < self.quantity:
                raise ValueError("Estoque insuficiente")

            self.product.stock -= self.quantity
        else:   
            self.product.stock += self.quantity

        self.product.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.movement_type} - {self.quantity} x {self.product.name}"
