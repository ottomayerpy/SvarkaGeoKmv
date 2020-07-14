from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='import_url'),
    path('startimport/', views.start_import, name='start_import_url')
]
