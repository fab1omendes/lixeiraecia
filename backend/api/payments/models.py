from django.db import models
from api.orders.models import Order


#Pagamento
class Payment(models.Model):
    METHOD_CHOICES = [
        ('pix', 'PIX'),
        ('card', 'Cartão'),
        ('cash', 'Dinheiro'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('approved', 'Aprovado'),
        ('failed', 'Falhou'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='pix')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Pagamento do pedido {self.order.id}"