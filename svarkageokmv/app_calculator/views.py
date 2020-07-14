from django.http import HttpResponse
from django.shortcuts import render

from .service import load_material


def calculator(request):
    answer = load_material()
    return render(request, 'calculator.html', answer)
