from django.urls import path 
from base.views import product_views as views 

urlpatterns = [

    #/api/products/:id/reviews/
    path('', views.getProducts, name='products'),

    path('create/', views.createProduct, name='product-create'),# need o move this up , becuase it's one param , it's gonna think it's a dynamic value
    path('upload/', views.uploadImage, name='image-upload'),# need o move this up , becuase it's one param , it's gonna think it's a dynamic value

    path('<str:pk>/reviews/', views.createProductReview, name='create-review'),
    path('top/',views.getTopProducts,name='top-products'),
    path('<str:pk>', views.getProduct, name='product'),
    
    path('update/<str:pk>/', views.updateProduct, name='product-delete'),
    path('delete/<str:pk>/', views.deleteProduct, name='product-delete'),
]