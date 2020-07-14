import json

from app_import.models import Material


def load_material():
    """ Загрузка материалов """

    data = {}

    try:
        material = json.loads(Material.objects.all()[0].data)
        data = {
            'data': material,
            'firsttype': material[0]['V'][0]
        }
    except IndexError:
        data = {
            'data': '',
            'firsttype': ''
        }

    return data
