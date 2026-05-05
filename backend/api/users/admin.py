from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Address

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Overwrite fieldsets to remove 'username'
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('name', 'avatar', 'phone', 'cpf', 'birthdate')}),
        ('Tipo de Usuário', {'fields': ('user_type', 'company_name', 'company_cnpj')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
        ('Status Sistema', {'fields': ('status',)}),
    )

    # Overwrite add_fieldsets for user creation
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'name', 'user_type', 'is_staff', 'is_active'),
        }),
    )

    list_display = ('email', 'name', 'is_staff', 'is_superuser', 'status')
    search_fields = ('email', 'name')
    ordering = ('email',)

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'city', 'state', 'is_default', 'is_billing')
    list_filter = ('is_default', 'is_billing', 'state')
    search_fields = ('user__email', 'name', 'city')
