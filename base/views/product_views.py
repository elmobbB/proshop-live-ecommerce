from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Review
from base.products import products
from base .serializers import ProductSerializer, UserSerializer , UserSerializerWithToken

from rest_framework import status   


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword', '')

    # products =Product.objects.filter(name__icontains=query).order_by('-createdAt')
    products =Product.objects.filter(name__icontains=query)

    page = request.query_params.get('page' ,1)
    if page == '':
        page = 1  # Set to 1 if page is an empty string
    else:
        page = int(page)  # Convert to integer

    print("page:@@2 " , page )
    paginator = Paginator(products , 5) #on each page , will sese two products
    
    try:
        products = paginator.page(page)

    except PageNotAnInteger:
        products = paginator.page(1)# return the first page

    except EmptyPage:
        products = paginator.page(paginator.num_pages)# return the last page


    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gt = 4).order_by('-rating')[0:5] #get by higher values, only get top five products
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data) 

@api_view(['POST'])
def createProduct(request): #pk for primary key
    user = request.user

    product = Product.objects.create(
        user = user,
        name = 'Sample Name',
        price = 0,
        brand = 'Sample Brand',
        countInStock = 0,
        category = 'Sample Category',
        description = '',
    )

    serializer = ProductSerializer(product, many=False) #just return one item so set many to false 
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request , pk): #pk for primary key
    product = Product.objects.get(_id = pk)
    serializer = ProductSerializer(product, many=False) #just return one item so set many to false 
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request , pk): #pk for primary key
    data = request.data
    product = Product.objects. get(_id =pk)

    product.name = data['name'] #update name
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False) 
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request , pk): #pk for primary key
    product = Product.objects.get(_id = pk)
    product.delete()
    return Response('Product Deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request , pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    #1 - Review already exists (cant let them write multiple review)
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content , status = status.HTTP_400_BAD_REQUEST)

    #2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating'}
        return Response(content , status = status.HTTP_400_BAD_REQUEST)

    #3 - Create Review
    else:
        Review.objects.create(
        user=user,
        product=product,
        name=user.first_name,
        rating=data['rating'],
        comment=data['comment'],  
        )
        # review = Review.objects.create(
        # user=user,
        # product=product,
        # name=user.first_name,
        # rating=data['rating'],
        # comment=data['comment'],  
        # )
        
        reviews = product.review_set.all()  
        product.numReviews=len(reviews) #once created review , passed in review 

        total = 0
        for i in reviews:
            total += i.rating
        
        product.rating = total /len(reviews)
        product.save()

        return Response({'detail': "Review Added"})
        





