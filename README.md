# SvarkaGeoKmv
Проект бизнеса по предоставлению услуг для пользователей.
Имеется:
* создание портфолио;
* прием и администрирование заказов;
* специализированный калькулятор расчета стоимости материалов.
## Install

Клонируйте данный репозиторий и перейдите в каталог SvarkaGeoKmv.
```
git clone https://github.com/ottomayerpy/SvarkaGeoKmv
cd SvarkaGeoKmv
```
Создайте и активируйте виртуальное окружение python.
```
python3 -m venv env
source env/bin/activate
```
Установите зависимости.
```
pip install -r requirements.txt
```
Перейдите в каталог svarkageokmv и проведите миграции.
```
cd svarkageokmv
python3 manage.py migrate
```
Создайте пользователя.
```
python3 manage.py createsuperuser
```
Активируйте сервер и пользуйтесь.
```
python3 manage.py runserver
```
