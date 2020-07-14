from django.db import models


class Order(models.Model):
    """ Заказы от пользователей на услуги """

    name = models.CharField('Название', max_length=255)
    username = models.CharField('Имя пользователя', max_length=255)
    phone = models.CharField('Телефон', max_length=255)
    email = models.CharField('Телефон', max_length=255)
    description = models.TextField('Описание')
    created_date = models.DateTimeField(
        'Дата создания', auto_now=False, auto_now_add=True)
    is_work = models.BooleanField('В работе', default=False)
    is_arhive = models.BooleanField('В архиве', default=False)

    def __str__(self):
        return self.name + ' (' + self.username + ')'

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
