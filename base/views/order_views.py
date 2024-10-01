from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer

from rest_framework import status
from datetime import datetime
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        if 'paymentMethod' in data:
            paymentMethod = data['paymentMethod']
        else:
            paymentMethod = None  # or a default value

        order = Order.objects.create(
            user=user,
            paymentMethod=paymentMethod,
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # (4) Update stock

            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        logger.debug(f"Debug: serializer.data = {serializer.data}")

        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user =request.user
    orders = user.order_set.all()  #get all user order then serialize them
    serializer = OrderSerializer(orders,many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()  #get all user order then serialize them
    serializer = OrderSerializer(orders,many = True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk): #pk = primary key

    user = request.user

    order = Order.objects.get(_id = pk) # by the order by id
    
    #two type of user to see user, buyer&staff
    try:
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)  #serial data , get one order , many is false
            return Response(serializer.data)
        else:
            Response({'detail': "Not authorized to view this order"}, status= status.HTTP_400_BAD_REQUEST) 
    except:
        return Response({'detail':'Order does not exist'}, status= status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    
    return Response('Order was paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()
    
    return Response('Order was delivered')