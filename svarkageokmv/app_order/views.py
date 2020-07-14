import math
import traceback

from api.service import catching_exceptions
from django.http import HttpResponse
from django.shortcuts import render

from .models import Order
from .service import _admin_page, _change_status, _create_order, _delete_order


def client_page(request):
    """ Страница приема заказа """

    name = request.GET.get("product", None)

    context = {
        'product': name,
    }

    return render(request, 'app_order/client.html', context)


def admin_page(request):
    """ Страница администрирования заказов """

    if not request.user.is_authenticated:
        return HttpResponse(status=404)

    current_page = request.POST.get('inpage', None)
    filter_active = request.POST.get('filteractive', None)

    answer = _admin_page(
        request.method, current_page, filter_active)

    context = {
        'orders': answer['orders'],
        'page': range(1, answer['page'] + 1),
        'current_page': current_page,
        'filter_active': filter_active,
    }

    return render(request, 'app_order/admin.html', context)


@catching_exceptions
def create_order(request):
    """ Создает заказ """

    name = request.POST.get('name', None)
    username = request.POST.get('username', None)
    phone = request.POST.get('phone', None)
    email = request.POST.get('email', None)
    description = request.POST.get('description', None)

    answer = _create_order(
        name, username, phone, email, description)

    return HttpResponse(answer)


@catching_exceptions
def delete_order(request):
    """ Удаляет заказ """

    id = request.POST.get('id', None)

    answer = _delete_order(id)

    return HttpResponse(answer)


@catching_exceptions
def change_status(request):
    """ Изменяет статус заказа """

    id = request.POST.get('id', None)
    status = request.POST.get('status', None)
    status_type = request.POST.get('typestatus', None)

    answer = _change_status(id, status, status_type)

    return HttpResponse(answer)
