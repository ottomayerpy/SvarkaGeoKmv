import json
import logging as log
import traceback
from datetime import datetime

from django.http import HttpResponse


def catching_exceptions(function):
    """ Декоратор для отлова не предвиденных исключений, а также проверка ajax """

    def wrapper(request):
        # Если запрос был не ajax, а например по прямой ссылке...
        if not request.is_ajax():
            return HttpResponse(status=404)

        try:
            return function(request)
        except Exception as err:
            # Логирование исключений в консоль
            log.error(traceback.format_exc())

            # Запись исключений в файл
            with open('../log.txt', 'a') as f:
                f.write('ERROR | {0} | {1} \n\n'.format(
                    datetime.now().strftime("%d.%m.%Y %H:%M:%S"), traceback.format_exc()))

            return HttpResponse(
                json.dumps(
                    {
                        'status': 'error',
                        'result': str(err),
                    }))
    return wrapper
