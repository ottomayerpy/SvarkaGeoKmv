from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='portfolio_url'),
    path('createportfolio/', views.create_portfolio, name='create_portfolio_url'),
    path('deleteportfolio/', views.delete_portfolio, name='delete_portfolio_url')
]
