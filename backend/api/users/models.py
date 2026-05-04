from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# User
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O usuário deve ter um email")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'P')  # 👈 importante

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    avatar = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)

    USER_TYPE_CHOICES = [
        ('pf', 'Pessoa Física'),
        ('pj', 'Pessoa Jurídica'),
    ]
    user_type = models.CharField(max_length=2, choices=USER_TYPE_CHOICES)

    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_cnpj = models.CharField(max_length=18, blank=True, null=True)

    STATUS_CHOICES = [
        ('A', 'Ativo'),
        ('I', 'Inativo'),
    ]
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='A')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  # 👈 ESSENCIAL

    def is_admin(self):
        return self.is_staff

    def __str__(self):
        return self.email

# Address
class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')

    name = models.CharField(max_length=100) # ex: "Casa", "Trabalho"
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    complement = models.CharField(max_length=255, blank=True, null=True)
    neighborhood = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=9)

    is_default = models.BooleanField(default=False) # Se for True, será o endereço principal
    is_billing = models.BooleanField(default=False) # Se for True, será o endereço de faturamento
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Force first address to be default and billing
        if not Address.objects.filter(user=self.user).exclude(id=self.id).exists():
            self.is_default = True
            self.is_billing = True

        if self.is_default:
            Address.objects.filter(user=self.user).exclude(id=self.id).update(is_default=False)
        if self.is_billing:
            Address.objects.filter(user=self.user).exclude(id=self.id).update(is_billing=False)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"