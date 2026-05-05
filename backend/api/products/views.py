from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from api.products.models import Product, Category, ProductImage


# =========================
# 📦 PRODUCTS
# =========================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def list_products(request):
    if request.method == 'GET':
        search = request.GET.get('search', '')
        products = Product.objects.filter(is_active=True)
        
        if search:
            products = products.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        data = [{
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'stock': p.stock,
            'image_url': p.image_url,
            'images': [img.image_url for img in p.images.all()],
            'size': p.size,
            'color': p.color,
            'category': p.category.name,
            'category_id': p.category.id,
            'is_active': p.is_active
        } for p in products]
        return Response(data)

    if request.method == 'POST':
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'Não autorizado'}, status=403)
        
        data = request.data
        try:
            category = Category.objects.get(id=data.get('category_id'))
            product = Product.objects.create(
                name=data.get('name'),
                description=data.get('description', ''),
                price=data.get('price'),
                stock=data.get('stock', 0),
                image_url=data.get('image_url', None),
                size=data.get('size'),
                color=data.get('color'),
                category=category,
                is_active=data.get('is_active', True)
            )
            
            # Extra images
            image_urls = data.get('image_urls', [])
            for url in image_urls:
                ProductImage.objects.create(product=product, image_url=url)
                
            return Response({'id': product.id}, status=201)
        except Category.DoesNotExist:
            return Response({'detail': 'Categoria inválida'}, status=400)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_detail(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Produto não encontrado'}, status=404)

    if request.method == 'GET':
        return Response({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock': product.stock,
            'image_url': product.image_url,
            'images': [img.image_url for img in product.images.all()],
            'size': product.size,
            'color': product.color,
            'category_id': product.category.id,
            'is_active': product.is_active
        })

    if not request.user.is_staff:
        return Response({'detail': 'Não autorizado'}, status=403)

    if request.method == 'PUT':
        data = request.data
        try:
            if 'category_id' in data:
                product.category = Category.objects.get(id=data['category_id'])
            
            product.name = data.get('name', product.name)
            product.description = data.get('description', product.description)
            product.price = data.get('price', product.price)
            product.stock = data.get('stock', product.stock)
            product.image_url = data.get('image_url', product.image_url)
            product.size = data.get('size', product.size)
            product.color = data.get('color', product.color)
            product.is_active = data.get('is_active', product.is_active)
            product.save()
            
            # Sync extra images
            if 'image_urls' in data:
                product.images.all().delete()
                for url in data['image_urls']:
                    ProductImage.objects.create(product=product, image_url=url)
                    
            return Response({'detail': 'Produto atualizado'})
        except Exception as e:
            return Response({'detail': str(e)}, status=400)

    if request.method == 'DELETE':
        product.delete()
        return Response(status=204)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def list_categories(request):
    if request.method == 'GET':
        search = request.GET.get('search', '')
        categories = Category.objects.all()
        
        if search:
            categories = categories.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        data = [{
            'id': c.id, 
            'name': c.name, 
            'description': c.description,
            'image_url': c.image_url
        } for c in categories]
        return Response(data)

    if request.method == 'POST':
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'Não autorizado'}, status=403)
        
        data = request.data
        try:
            category = Category.objects.create(
                name=data.get('name'),
                description=data.get('description', ''),
                image_url=data.get('image_url', None)
            )
            return Response({'id': category.id}, status=201)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, pk):
    try:
        category = Category.objects.get(id=pk)
    except Category.DoesNotExist:
        return Response({'detail': 'Categoria não encontrada'}, status=404)

    if request.method == 'GET':
        return Response({
            'id': category.id, 
            'name': category.name, 
            'description': category.description,
            'image_url': category.image_url
        })

    if not request.user.is_staff:
        return Response({'detail': 'Não autorizado'}, status=403)

    if request.method == 'PUT':
        data = request.data
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)
        category.image_url = data.get('image_url', category.image_url)
        category.save()
        return Response({'detail': 'Categoria atualizada'})

    if request.method == 'DELETE':
        if category.products.exists():
            return Response({'detail': 'Não é possível excluir categoria com produtos vinculados'}, status=400)
        category.delete()
        return Response(status=204)


