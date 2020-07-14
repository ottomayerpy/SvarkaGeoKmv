import csv
import json
import os

import pandas
from django.core.files.storage import FileSystemStorage
from svarkageokmv.settings import MEDIA_ROOT

from .models import Material


def _upload_file_to_media_folder(uploaded_file):
    """ Загрузка файла в медиа папку (файл excel) """
    fs = FileSystemStorage()
    name = fs.save(uploaded_file.name, uploaded_file)
    return fs.url(name)


def _start_import(name):
    """ Запуск импорта excel файла """

    excelfile = _convert_xls_to_csv(name)
    json_list = _making_json_list(excelfile)

    Material.objects.all().delete()
    material = Material()
    material.data = json_list
    material.save()

    return json.dumps(
        {
            'status': 'success',
        })


def _convert_xls_to_csv(name):
    """ Конвертирует файл excel в формат csv """

    data_xls = pandas.read_excel(
        MEDIA_ROOT + name, 0, index_col=0, index=False, skiprows=range(0, 2))
    # Удаляем не нужные столбцы с помощью переименования
    data_xls.rename(columns={'Unnamed: 1': '', 'Unnamed: 2': ''}, inplace=True)
    data_xls.to_csv(MEDIA_ROOT + 'materialtmp.csv', encoding='utf-8')

    excelfile = csv.reader(
        open(MEDIA_ROOT + 'materialtmp.csv', encoding='utf-8'), delimiter=",")

    os.remove(MEDIA_ROOT + name)
    os.remove(MEDIA_ROOT + "materialtmp.csv")

    return excelfile


def _making_json_list(excelfile):
    material_type = ""
    data = list()
    types = list()

    for row in excelfile:
        if row[1] == '' and row[2] == '':
            material_type = row[0]
            types.append(row[0])
            continue
        # T - Type; V - Value; N - Name; U - Unitofmeasurement; C - Cost.
        data.append({'T': material_type, 'V': {
            'N': row[0], 'U': row[1], 'C': row[2]}})

    data.insert(0, {'T': 'Types', 'V': types})

    return json.dumps(data)
