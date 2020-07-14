import json
from math import ceil

from .models import Order


def _admin_page(request_method, current_page, filter_active):
    """ Страница администрирования заказов """

    orders = Order.objects.all()
    page = 1  # Страница
    offset = 0  # Начало вырезки базы
    limit = 50  # Конец вырезки базы

    if request_method == 'POST':
        offset = int(current_page) * 50 - 50
        limit = offset + 50

    if filter_active == 'True':  # Активные
        orders = orders.order_by(
            '-created_date').filter(is_work=True, is_arhive=False)[offset:limit]
    elif filter_active == 'False':  # Не активные
        orders = orders.order_by(
            '-created_date').filter(is_work=False, is_arhive=False)[offset:limit]
    elif filter_active == 'Arhive':  # Архив
        orders = orders.order_by(
            '-created_date').filter(is_arhive=True)[offset:limit]
    else:  # Все
        orders = orders.order_by(
            '-created_date').filter(is_arhive=False)[offset:limit]

    if orders.count() > 50:
        # Вычисляем какой номер для страницы соответствует текущей вырезке из базы
        page = ceil(orders.count() / 50)

    return {
        'orders': orders,
        'page': page,
    }


def _create_order(name, username, phone, email, description):
    """ Создает заказ """

    order = Order()
    order.name = name
    order.username = username
    order.phone = phone
    order.email = email
    order.description = description
    order.save()

    return json.dumps(
        {
            'status': 'success',
        })


def _delete_order(id):
    """ Удаляет заказ """

    order = Order.objects.get(id=id)
    order.delete()

    return json.dumps(
        {
            'status': 'success',
        })


def _change_status(id, status, status_type):
    """ Изменяет статус заказа """

    order = Order.objects.get(id=id)

    if status_type == 'is_work':
        if status == 'true':
            order.is_work = True
        else:
            order.is_work = False
    elif status_type == 'is_arhive':
        if status == 'true':
            order.is_arhive = True
        else:
            order.is_arhive = False

    order.save()

    return json.dumps(
        {
            'status': 'success',
        })
