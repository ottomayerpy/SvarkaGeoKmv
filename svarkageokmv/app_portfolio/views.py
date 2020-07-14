from api.service import catching_exceptions
from django.http import HttpResponse
from django.shortcuts import render

from .models import Portfolio
from .service import (_create_portfolio, _delete_portfolio,
                      _upload_file_to_media_folder)


def index(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=404)

    context = {
        'Portfl': Portfolio.objects.all(),
    }

    if request.method == 'POST':
        context['url'] = _upload_file_to_media_folder(
            request.FILES['document'])

    return render(request, 'portfolio.html', context)


@catching_exceptions
def create_portfolio(request):
    """ Создать портфолио """

    name = request.POST.get('name', None)
    filename = request.POST.get('filename', None)
    url = request.POST.get('url', None)
    cost_from = request.POST.get('cost_from', None)
    cost_to = request.POST.get('cost_to', None)

    answer = _create_portfolio(
        name, filename, url, cost_from, cost_to)

    return HttpResponse(answer)


@catching_exceptions
def delete_portfolio(request):
    """ Удалить портфолио """

    id = request.POST.get('id', None)
    image_name = request.POST.get('image', None)

    answer = _delete_portfolio(id, image_name)

    return HttpResponse(answer)
