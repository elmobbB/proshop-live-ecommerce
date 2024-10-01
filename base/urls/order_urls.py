
#  connecting the views to url
from django.urls import path 
from base.views import order_views as views 

urlpatterns = [
    path('', views.getOrders, name='orders'),  #api/orders/myorders
    path('add/', views.addOrderItems, name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),  #api/orders/myorders
    
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'), 
    path('<str:pk>/', views.getOrderById, name='user-add'), 
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),#api/orders/orderID
]