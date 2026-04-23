from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from api.users.models import CustomUser, Address
from api.products.models import Product, Category
from api.orders.models import Order, OrderItem

from rest_framework.authtoken.models import Token


# =========================
# 🔐 AUTH
# =========================

@api_view(['GET'])
@permission_classes([AllowAny])
def check_email(request):
    email = request.GET.get('email')
    exists = CustomUser.objects.filter(email=email).exists()
    return Response({'exists': exists})


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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user

    return Response({
        'id': user.id,
        'email': user.email,
        'name': user.name
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
    addresses = request.user.addresses.all()

    data = []
    for a in addresses:
        data.append({
            'id': a.id,
            'name': a.name,
            'street': a.street,
            'number': a.number,
            'city': a.city,
            'state': a.state,
            'zip_code': a.zip_code,
            'is_default': a.is_default
        })

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_address(request):
    data = request.data

    address = Address.objects.create(
        user=request.user,
        name=data['name'],
        street=data['street'],
        number=data['number'],
        neighborhood=data['neighborhood'],
        city=data['city'],
        state=data['state'],
        zip_code=data['zip_code'],
        is_default=data.get('is_default', False)
    )

    return Response({'id': address.id})


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