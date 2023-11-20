# backtest
## Установка зависимостей

Для начала работы необходимо установить следующие зависимости:

- express pg
- nodemon
- cors

Для этого выполните следующие команды в терминале:

```bash
npm init -y
```
```bash
npm install express pg
```
```bash
npm install -D nodemon
```
```bash
npm install -i cors
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

- Откройте консоль PostgreSQL и введя пароль, войдите в субд.
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
- Если вывело сообщение `CREATE DATABASE` то база данных была успешно создана.

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
  const delete = await db.query(`DELETE FROM название_таблицы where id = $1`, [id])
  res.json(delete.rows[0])
```
На этом основная работа с базами данных будет закончена.

## Визуал.

В корневой папке проекта создайте файл `index.html`, в нём нам понадобится создать поля imput, создавайте столько-же полей сколько вы создали полей данных в вашей базе данных. В моём случае понадобится два поля. Я буду использовать bootstrap для облегчения работы.
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <form class="form mb-3" id="form">
            <div class="row m-auto">
                <div class="mb-3">
                    <input id="car-name" class="form-control" placeholder="Название">
                </div>
                <div class="mb-3">
                    <input id="car-description" class="form-control" placeholder="Описание">
                </div>
            </div>
            <div class="btn-group float-end">
                <button class="btn btn-primary">Добавить</button>
            </div>
        </form>

        <div class="row mt-5 mb-2" id="car-list">

        </div>
    </div>
    <script type="module" src="/frontend/main.js"></script>
</body>
</html>
```
Так как далее мы быдем получать данные из одной локальной ссылке в другой, нужно подключить импортированный ранее метод cors в `index.js`.
```javascript
const cors = require('cors')
```
```javascript
app.use(cors())
```
Далее создайте в корневой папке новую папку и назовите её `frontend`, там создайте файл `requests.js`.
В нём мы экспортируем все созданные нами функции используя fetch функцию cors. Это нужно для доступа к бд через фронтенд:
```javascript
export async function create(car){
    await fetch('http://localhost:8080/car', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: car.name,
            description: car.description,
        })
    })
}
export async function getAll(){
    const response = await fetch('http://localhost:8080/car', {
        method: 'GET'
    })
    const result = await response.json()
    console.log(result)
    return result
}
export async function getOne(id){
    const response = await fetch('http://localhost:8080/car/' + id, {
        method: 'GET'
    })
    const result = await response.json()
    console.log(result)
    return result
}
export async function delete(id){
    await fetch('http://localhost:8080/car/' + id, {
        method: 'DELETE'
    })
}
export async function update(car){
    await fetch('http://localhost:8080/car', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: car.id,
            name: car.name,
            description: car.description,
        })
    })
}
```

Далее в той-же папке создайте новую папку с названием `components` и в ней файл `item.js`.
Это будет наш видимый компонент который мы будет создавать вытягивая данные из бд.
В файл вы должны экспортировать функцию createItem которая будет принимать поля вашей бд.
Далее создаёте карточку item которая будет отображаться при добавлении новой записи в бд.
Вот что вышло у меня:
```javascript
export function createItem(name, description){
    let divBody = document.createElement('div')
    let h5 = document.createElement('h5')
    let pDescription = document.createElement('p')

    let buttongroup = document.createElement('div')
    let btnDetail = document.createElement('button')
    let btnDelete = document.createElement('button')

    item.classList.add('card', 'm-3')
    item.style.width = '18rem'
    item.style.float = 'left'

    image.classList.add('card-img-top')

    divBody.classList.add('card-body')

    h5.classList.add('card-title')
    h5.innerText = name

    pDescription.classList.add('card-text')
    pDescription.innerText = description


    buttongroup.classList.add('btn-group', 'float-end')
    btnDetail.classList.add('btn', 'btn-primary')
    btnDetail.textContent = "Подробнее"

    btnDelete.classList.add('btn', 'btn-danger')
    btnDelete.textContent = "Удалить"

    buttongroup.append(btnDetail, btnDelete)
    divBody.append(h5, pDescription, buttongroup)

    item.append(divBody)

    return {item, btnDetail, btnDelete}
}
```

В папке `frontend` создайте ещё один файл `main.js`, в него импортируем два файла что мы только-что написали а также их функции.
```javascript
import { createItem } from "./components/item.js"
import { getAll, getOne, create, delete, update } from "./requests.js"
```
Далее создаём немедленно вызываемую функцию и в ней объявляем класс с конструктором, в моём случае я его назвал Car.
```javascript
(function(){
    class Car{
        constructor(name, description){
            this.name = name
            this.description = description
        }
        newCar(id, name, description){
            this.id = id
            this.name = name
            this.description = description
        }
    }
    const list = document.getElementById('car-list')


    async function generateElements(){
        const cars = await getAllCars()
        for(let car of cars){
            let listItem = createItem(car.name, car.description)
            listItem.btnDelete.addEventListener('click', function(){
                if(confirm("Вы уверены что хотите удалить?")){
                    deleteCar(car.id)
                    listItem.item.remove()

                }

            })
            listItem.btnDetail.addEventListener('click', function(){
                window.location.replace('https://www.youtube.com/watch?v=dwlz6p_LZnY')
            })
            list.append(listItem.item)
        }
    }

    document.addEventListener('DOMContentLoaded', function(){

        const form = document.getElementById('form')
        generateElements()
        form.addEventListener('submit', function(e){
            e.preventDefault()

            let carName = document.getElementById('car-name')
            let carDescription = document.getElementById('car-price')

            let listItem = createItem(carName.value, carDescription.value)
            let car = new Car(carName.value, carDescription.value)
            createCar(car)
            list.append(listItem.item )
        })
    })
})()
```
