from django.contrib import admin
from django.contrib.auth import views
from django.urls import include, path

urlpatterns = [
    path('', include('app_home.urls')),
    path('calculator/', include('app_calculator.urls')),
    path('import/', include('app_import.urls')),
    path('portfolio/', include('app_portfolio.urls')),
    path('order/', include('app_order.urls')),
    path('login/', views.LoginView.as_view(), name='login_url'),
    path('logout/', views.LogoutView.as_view(), name='logout_url'),
]
