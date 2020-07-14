from django.urls import path

from . import views

urlpatterns = [
    path('', views.client_page, name='order-client_page_url'),
    path('createorder/', views.create_order, name='create_order_url'),
    path('admin/', views.admin_page, name='order-admin_page_url'),
    path('admin/deleteorder/', views.delete_order, name='delete_order_url'),
    path('admin/changestatus/', views.change_status, name='changestatus_url')
]
