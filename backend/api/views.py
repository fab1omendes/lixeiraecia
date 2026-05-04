from django.contrib.auth import authenticate
from django.db import transaction, models as django_models
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import BaseUserManager

from api.users.models import CustomUser, Address
from api.products.models import Product, Category
from api.orders.models import Order, OrderItem

from rest_framework.authtoken.models import Token


# =========================
# 🔐 AUTH
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return Response({'detail': 'Senha atual e nova senha são obrigatórias'}, status=400)
    
    if not user.check_password(current_password):
        return Response({'detail': 'Senha atual incorreta'}, status=400)
    
    user.set_password(new_password)
    user.save()
    return Response({'detail': 'Senha alterada com sucesso'})

@api_view(['GET'])
@permission_classes([AllowAny])
def check_email(request):
    email = request.GET.get('email')
    exists = CustomUser.objects.filter(email=email).exists()
    return Response({'exists': exists})

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    data = request.data
    if CustomUser.objects.filter(email=data.get('email')).exists():
        return Response({'detail': 'Email já cadastrado'}, status=400)
    
    try:
        user = CustomUser.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            name=data.get('name', ''),
            phone=data.get('phone', ''),
            cpf=data.get('cpf', ''),
            birthdate=data.get('birth_date') or None,
            user_type=data.get('user_type', 'pf'),
            company_name=data.get('company_name', ''),
            company_cnpj=data.get('company_cnpj', '')
        )
        
        # Opcional: Salvar o endereço principal se enviado
        principal_address = data.get('principal_address')
        if principal_address:
            Address.objects.create(
                user=user,
                name='Endereço Principal',
                street=principal_address,
                number=data.get('principal_address_number', ''),
                complement=data.get('principal_address_complement', ''),
                neighborhood=data.get('principal_address_neighborhood', ''),
                city=data.get('principal_city', ''),
                state=data.get('principal_state', ''),
                zip_code=data.get('principal_zip_code', ''),
                is_default=True
            )
            
    except Exception as e:
        return Response({'detail': str(e)}, status=400)
        
    return Response({'id': user.id, 'email': user.email}, status=201)



@api_view(['POST'])
@permission_classes([AllowAny])
def create_user_google(request):
    data = request.data

    if CustomUser.objects.filter(email=data.get('email')).exists():
        return Response({'detail': 'Usuário já existe'}, status=400)

    user = CustomUser.objects.create_user(
        email=data['email'],
        name=data.get('name', ''),
        user_type='P'
    )

    return Response({
        'id': user.id,
        'email': user.email
    })




@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email:
        email = BaseUserManager.normalize_email(email)

    print(f"DEBUG LOGIN: email='{email}', password='{password}'")

    user = authenticate(request, email=email, password=password)

    if not user:
        return Response({'detail': 'Credenciais inválidas'}, status=401)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'id': user.id,
        'email': user.email,
        'token': token.key
    })


# =========================
# 👤 USER
# =========================

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user

    if request.method in ['PUT', 'PATCH']:
        data = request.data
        user.avatar = data.get('avatar', user.avatar)
        user.name = data.get('name', user.name)
        user.phone = data.get('phone', user.phone)
        user.cpf = data.get('cpf', user.cpf)
        user.birthdate = data.get('birthdate', user.birthdate)
        user.user_type = data.get('user_type', user.user_type)
        user.company_name = data.get('company_name', user.company_name)
        user.company_cnpj = data.get('company_cnpj', user.company_cnpj)
        user.save()

    return Response({
        'id': user.id,
        'email': user.email,
        'avatar': user.avatar,
        'name': user.name,
        'phone': user.phone,
        'cpf': user.cpf,
        'birthdate': user.birthdate,
        'user_type': user.user_type,
        'company_name': user.company_name,
        'company_cnpj': user.company_cnpj,
    })


# =========================
# 📦 PRODUCTS
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def list_products(request):
    products = Product.objects.filter(is_active=True)

    data = []
    for p in products:
        data.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'stock': p.stock,
            'category': p.category.name
        })

    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    categories = Category.objects.all()

    data = [{'id': c.id, 'name': c.name} for c in categories]
    return Response(data)


# =========================
# 📍 ADDRESS
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_addresses(request):
    addresses = request.user.addresses.all().order_by('id')

    data = []
    for a in addresses:
        data.append({
            'id': a.id,
            'name': a.name,
            'street': a.street,
            'number': a.number,
            'complement': a.complement,
            'neighborhood': a.neighborhood,
            'city': a.city,
            'state': a.state,
            'zip_code': a.zip_code,
            'is_default': a.is_default,
            'is_billing': a.is_billing,
            'contact_name': a.user.name,
            'contact_phone': a.user.phone
        })

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_address(request):
    data = request.data

    is_default = data.get('is_default', False)
    is_billing = data.get('is_billing', False)

    if is_default:
        Address.objects.filter(user=request.user).update(is_default=False)
    if is_billing:
        Address.objects.filter(user=request.user).update(is_billing=False)

    # First address is implicitly billing if none exists
    if not Address.objects.filter(user=request.user).exists():
        is_billing = True
        is_default = True

    address = Address.objects.create(
        user=request.user,
        name=data.get('name', 'Endereço'),
        street=data.get('street', ''),
        number=data.get('number', ''),
        complement=data.get('complement', ''),
        neighborhood=data.get('neighborhood', ''),
        city=data.get('city', ''),
        state=data.get('state', ''),
        zip_code=data.get('zip_code', ''),
        is_default=is_default,
        is_billing=is_billing
    )

    return Response({'id': address.id}, status=201)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def edit_address(request, pk):
    try:
        address = Address.objects.get(id=pk, user=request.user)
    except Address.DoesNotExist:
        return Response({'detail': 'Endereço não encontrado.'}, status=404)

    data = request.data
    
    # Update fields if present in data
    if 'name' in data: address.name = data['name']
    if 'street' in data: address.street = data['street']
    if 'number' in data: address.number = data['number']
    if 'complement' in data: address.complement = data['complement']
    if 'neighborhood' in data: address.neighborhood = data['neighborhood']
    if 'city' in data: address.city = data['city']
    if 'state' in data: address.state = data['state']
    if 'zip_code' in data: address.zip_code = data['zip_code']
    
    # Toggle bits
    if 'is_default' in data:
        address.is_default = data['is_default']
    if 'is_billing' in data:
        address.is_billing = data['is_billing']

    try:
        address.save()
    except Exception as e:
        return Response({'detail': f'Erro ao salvar: {str(e)}'}, status=400)

    return Response({'detail': 'Endereço atualizado.'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_address(request, pk):
    try:
        address = Address.objects.get(id=pk, user=request.user)
        
        was_default = address.is_default
        was_billing = address.is_billing
        
        address.delete()
        
        # After deletion, check if we need to promote another address
        others = Address.objects.filter(user=request.user)
        if others.exists():
            new_primary = others.first()
            if was_default and not others.filter(is_default=True).exists():
                new_primary.is_default = True
            if was_billing and not others.filter(is_billing=True).exists():
                new_primary.is_billing = True
            new_primary.save()
            
        return Response(status=204)
    except Address.DoesNotExist:
        return Response({'detail': 'Endereço não encontrado.'}, status=404)
    except django_models.ProtectedError:
        return Response({'detail': 'Este endereço está vinculado a pedidos existentes e não pode ser excluído.'}, status=400)
    except Exception as e:
        return Response({'detail': str(e)}, status=500)



# =========================
# 🛒 ORDER (Checkout)
# =========================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_order(request):
    """
    Espera receber do frontend (Next):

    {
      "address_id": 1,
      "items": [
        { "product_id": 1, "quantity": 2 },
        { "product_id": 3, "quantity": 1 }
      ]
    }
    """

    data = request.data
    user = request.user

    try:
        address = Address.objects.get(id=data['address_id'], user=user)
    except Address.DoesNotExist:
        return Response({'detail': 'Endereço inválido'}, status=400)

    order = Order.objects.create(
        user=user,
        address=address
    )

    total = 0

    for item in data['items']:
        product = Product.objects.get(id=item['product_id'])

        if product.stock < item['quantity']:
            return Response({
                'detail': f'Estoque insuficiente para {product.name}'
            }, status=400)

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item['quantity'],
            price=product.price
        )

        total += product.price * item['quantity']

        # 🔻 baixa estoque
        product.stock -= item['quantity']
        product.save()

    order.total = total
    order.save()

    return Response({
        'order_id': order.id,
        'total': total
    })