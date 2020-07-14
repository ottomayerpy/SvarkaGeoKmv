from app_portfolio.models import Portfolio
from django.shortcuts import render


def index(request):
    return render(request, 'home.html', {'Portfl': Portfolio.objects.all()})
