**Система Тендеров - README**

**Обзор**
------------

Система Тендеров - это комплексная платформа, предназначенная для упрощения процесса проведения тендеров для бизнеса и организаций. 
Разработанная с использованием Laravel 10 и Next.js, эта система предоставляет надежное и масштабируемое решение для управления тендерами, заявками и контрактами.

Проект был написан в рамках проектной работы и успешно защищен перед реальными заказчиками.

**Ключевые Возможности**
----------------

1. **Управление Тендерами**: Создание, управление и отслеживание тендеров от начала до конца.
2. **Управление Заявками**: Позволяет участникам подавать заявки и отслеживать их статус.
3. **Управление Контрактами**: Управление контрактами и отслеживание их выполнения.
4. **Управление Пользователями**: Управление ролями и разрешениями пользователей для безопасного доступа.
5. **Фильтрация и Сортировка**: Поиск и фильтрация тендеров, заявок и контрактов по различным критериям.
6. **Уведомления**: Получение уведомлений об обновлениях тендеров, подаче заявок и изменениях контрактов.

**Скриншоты**
-------------------------
![image](https://github.com/gxldmane/tender_system/assets/86232485/81d27c7b-0b91-4e2a-9699-f8d9529260df)
![image](https://github.com/gxldmane/tender_system/assets/86232485/92fc3d52-7023-48a6-95b0-82d82108911b)
![image](https://github.com/gxldmane/tender_system/assets/86232485/dbe468d5-1e6a-4172-bc96-18526266bcfc)
![image](https://github.com/gxldmane/tender_system/assets/86232485/0d0a43f9-b095-49ee-95dd-eda3314cc710)





**Стек**
-------------------------

### Фронтенд
- **Next.js**: Версия 14.1.3
- **React**: Версия 18

### Бэкенд
- **Laravel**: Версия 10.10
- **PHP**: Версия 8.3
- **MySQL**: Версия 8.0
- **Docker**

**Установка**
--------------

Cперва клонируйте репозиторий: `git clone https://github.com/gxldmane/tender_system.git`

### Бэкенд
1. Перейдите в директорию проекта `cd tender_system`
2. Перейдите в директорию backend `cd backend`
3. Отредактируйте `.env.example` на `.env`
4. Установите все зависимости `composer install`
5. Сгерерируйте ключ приложения `php artisan key:generate`
6. Запустите докер контейнер `docker compose up -d`
7. Зайдите в контейнер app `docker compose exec app bash`
8. Создайте новую базу данных `php artisan migrate:fresh --seed`
9. Запустите scheduler `php artisan schedule:work`

### Фронтенд
1. Перейдите в директорию frontend `cd frontend`
2. Установите yarn если у вас его нет `npm install --global yarn`
3. Установите зависимости: `yarn install`
4. Запустите сервер разработки: `yarn dev`

**Использование**
---------

### Фронтенд
1. Откройте `http://localhost:3000` в своем браузере, чтобы получить доступ к фронтенду.
2. Войдите в систему с вашими учетными данными, чтобы получить доступ к системе.

### Бэкенд
1. Откройте `http://localhost:8080` в своем браузере, чтобы получить доступ к бэкенду.
2. Можете тестировать наш API используя документацию: https://documenter.getpostman.com/view/29784083/2sA2xmWBFy

**Вклад**
--------------

Вклады приветствуются. Пожалуйста, создайте новый запрос на исправление или новый запрос, чтобы обсудить изменения или дополнения к системе.

**Лицензия**
---------

Система Тендеров распространяется под лицензией MIT.

**Авторы**
---------

- **gxldmane** (backend developer): thodotaev@gmail.com
- **ivoxi** (frontend developer):
ilya.vokhmyanin@yandex.ru
- **glowgrew** (frontend developer):

**Благодарности**
----------------

- **Laravel**: За предоставление надежного PHP-фреймворка.
- **Next.js**: За предоставление мощного фреймворка фронтенда на основе React.
- **React**: За предоставление популярной JavaScript-библиотеки для создания пользовательских интерфейсов.
- **ПГНИУ**: За идею и поддержку при разработке
