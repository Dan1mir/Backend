# backtest
## Установка зависимостей

Для начала работы необходимо установить следующие зависимости:

- express pg
- nodemon

Для этого выполните следующие команды в терминале:

```bash
npm init -y
npm install express pg
npm install -D nodemon
```

## Создание сервера

Для создания сервера необходимо создать файл `index.js` в корневой папке проекта и импортировать модуль `express`:

```javascript
const express = require('express');
```

Затем задайте порт, на котором будет работать сервер, например, `8080`:

```javascript
const PORT = 8080;
```

Далее создайте экземпляр приложения `express` и запустите сервер на указанном порту:

```javascript
const app = express();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

## Настройка скриптов

Для удобства запуска и разработки программы можно настроить скрипты в файле `package.json`. Для этого добавьте следующие строки в раздел `scripts`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

Теперь вы можете запускать программу с помощью команды `npm run start` или `npm run dev`. При использовании `npm run dev` сервер будет автоматически перезапускаться при изменении файлов.

## Подключение к базе данных

Для работы с базой данных необходимо установить модуль `pg` и создать файл `db.js` в корневой папке проекта. В этом файле импортируйте класс `Pool` из модуля `pg` и создайте экземпляр этого класса, передав ему параметры для подключения к базе данных PostgreSQL:

```javascript
const Pool = require('pg').Pool;
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "название_бд"
});

module.exports = pool
```

Замените `название_бд` на имя вашей базы данных которую мы создадим далее.

## Создание базы данных и таблицы

Для создания таблицы в базе данных необходимо выполнить следующие действия:

- Откройте папку, в которой установлен PostgreSQL, и в ней папку `bin`.
- Откройте в этой папке PowerShell и используя команду `psql -U postgres` и введя пароль, войдите в субд.
- Если у вас имеются какие-то проблемы с кодировкой, то введите команду `psql \! chcp 1251`, текст должен отображаться корректно.
- После успешного входа в субд создайте новую базу данных, введя команду `create database название_бд;`
- Создайте файл `database.sql` в корневой папке проекта и в нем напишите команду для создания таблицы, например:

```sql
create table название_таблицы (
  id serial primary key,
  name varchar(255),
  description varchar(255)
);
```

- Вернитесь в PowerShell, пропишите команду `\connect название_бд` и вставьте код таблицы, что вы написали в файле `database.sql`.

После этих шагов таблица должна быть создана в базе данных.

## Создание запросов

В корневой папке проекта создайте две новые папки `controllers`, в ней мы будем работать непосредственно с запросами, и папку `routes` в которой будут маршруты по которым нужно будет отправлять сами запросы.
В каждой из новосозданных папок создайте js файл, я их назвал `car.controllers` и `car.routes` .

В файле `controllers` создайте новый класс и внутри него создайте ассинхронные функции для создания, получения, обновления и удаления данных в бд:

```javascript
class Controller{
    async create(req, res){
  }
    async getAll(req, res){
  }
    async getOne(req, res){
  }
    async update(req, res){
  }
    async delete(req, res){
  }
}
module.exports = new Controller()
```

В файле `routes` получаем из express класс Router.

```javascript
const Router = require('express')
const router = new Router()
const Controller = require('../controller/car.controller.js')//Сразу-же импортируем класс контроллера который мы создали

module.export = router
```
Далее в этом-же файле для каждой из функций определим маршрут по которой она будет отрабатывать по шаблону `url, автор.функция`:

```javascript
router.post('/car', Controller.create)
router.get('/car', Controller.getAll)
router.get('/car/:id', Controller.getOne) //указываем id для получения нужного объекта
router.put('/car', Controller.update)
router.delete('/car/:id', Controller.delete) //то-же самое
```

Теперь необходимо вернуться в файл `index.js` и экспортировать наш Router:
```javascript
const Router = require('./routes/car.routes.js')
```
А также добавить запрос на него:
```javascript
app.use(express.json)
app.use(Router)
```

## Функционал

Вернёмся в файл `car.controllers`.
Попробуем написать первый post запрос на добавление новой записи (в этом случае машины) в нашу базу данных, для этого экспортируем её в наш файл:
```javascript
const db = require('../db.js')
```
Так как post запрос имеет тело, воспользуемся деструктуризацией:
```javascript
async create(req, res){
  const{name, description} = req.body
  const newCar = await db.query(`INSERT INTO название_таблицы (name, description) values ($1, $2) RETURNING *`, [name, description])
  res.json(newCar.rows[0])
}
```
> [!TIP]
> Вы можете проверить работает ли добавление записей.
>  Зайдите в Postman, выберете `POST` запрос и напишите url, в моём случае это `http://localhost:8080/car`. Выберете пункт body, выберете там JSON и введите в окне ниже данные которые есть в вашей таблице.
>  В моём случае запрос выглядит так:
>  ```json
>  {
>    "name": "test",
>    "description": "test"
>  }
>  ```
>  И отправляете запрос на кнопку Send.
>  Далее возвращаемся в PowerShell и командой `select * from название_таблицы;` проверяете добавились ли в неё данные.

Продолжим писать запросы.
Следующий запрос на получение всех записей из таблицы. Это в как-раз та-же операция что мы делали в субд.
```javascript
async getAll(req, res){
  const cars = await db.query(`SELECT * FROM название_таблицы`)
  res.json(cars.rows)
}
```
Далее запрос на получение одной конкретной записи.
Запрос будет почти такой-же как и прошлый за исключением того что мы получаем из параметров запроса id.
```javascript
async getOne(req, res){
  const id = req.params.id
  const car = await db.query(`SELECT * FROM название_таблицы where id = $1`, [id])
  res.json(car.rows[0])
}
```

Следующий запрос - обновление данных.
Получаем из тела запроса его id, и данные которые вы внесли в таблицу, в моём случае это name и description.
```javascript
async update(req, res){
  const {id, name, description} = req.body
  const update = await db.query(`UPDATE название_таблицы set name = $1, description = $2 where id = $3 RETURNING *`, [name, description, id])
  res.json(update.rows[0])
}
```

Остаётся последняя функция - удаление.
Она очень похожа на getOne, поэтому всё что мы сделаем это скопируем код и отредактируем sql запрос.
```javascript
  const deleteCar = await db.query(`DELETE FROM название_таблицы where id = $1`, [id])
```
