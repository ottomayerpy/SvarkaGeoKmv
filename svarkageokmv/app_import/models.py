from django.db import models


class Material(models.Model):
    """ Материалы для калькулятора """

    data = models.TextField('Данные')

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
