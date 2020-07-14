import json
import os
import shutil

from django.core.files.storage import FileSystemStorage

from .models import Portfolio

STATIC_PATH = 'static/img/portfolio/'
MEDIA_PATH = 'media/'


def _upload_file_to_media_folder(uploaded_file):
    """ Загрузка файла в медиа папку (файл картинки для портфолио) """

    fs = FileSystemStorage()
    name = fs.save(uploaded_file.name, uploaded_file)
    shutil.copyfile(MEDIA_PATH + uploaded_file.name,
                    STATIC_PATH + uploaded_file.name)
    os.remove(MEDIA_PATH + uploaded_file.name)

    return fs.url(name)


def _create_portfolio(name, filename, url, cost_from, cost_to):
    """ Создать портфолио """

    if os.path.isfile(STATIC_PATH + filename):
        return json.dumps(
        {
            'status': 'error',
            'text': 'error-img-name',
        })

    portfolio = Portfolio()
    portfolio.name = name
    portfolio.image = filename
    portfolio.url = url
    portfolio.cost_from = cost_from
    portfolio.cost_to = cost_to
    portfolio.save()

    return json.dumps(
        {
            'status': 'success',
        })


def _delete_portfolio(id, image_name):
    """ Удалить портфолио """

    portfolio = Portfolio.objects.get(id=id)
    portfolio.delete()

    os.remove(STATIC_PATH + image_name)

    return json.dumps(
        {
            'status': 'success',
        })
