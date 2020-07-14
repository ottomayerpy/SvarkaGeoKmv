from api.service import catching_exceptions
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.shortcuts import render

from .models import Material
from .service import _start_import, _upload_file_to_media_folder


def index(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=404)

    answer = None

    if request.method == 'POST':
        answer = _upload_file_to_media_folder(
            request.FILES['document'])

    return render(request, 'import.html', {'url': answer})


@catching_exceptions
def start_import(request):
    """ Запуск импорта """

    name = request.POST.get('filename', None)
    answer = _start_import(name)
    return HttpResponse(answer)
