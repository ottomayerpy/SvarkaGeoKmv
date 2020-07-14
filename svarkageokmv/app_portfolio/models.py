from django.db import models


class Portfolio(models.Model):
    """ Портфолио сайта """

    name = models.CharField('Название', max_length=30)
    image = models.TextField('Путь или ссылка на изображение')
    url = models.TextField('Ссылка')
    cost_from = models.IntegerField('Стоимость от')
    cost_to = models.IntegerField('Стоимость до')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Портфолио'
        verbose_name_plural = 'Портфолио'
