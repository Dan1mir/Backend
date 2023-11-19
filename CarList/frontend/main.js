import { createItem } from "./components/item.js"
import { getAllCars, getCar, createCar, deleteCar, updateCar } from "./requests.js"

(function(){
    class Car{
        constructor(name, description, price, img){
            this.name = name
            this.description = description
            this.price = price
            this.img = img
        }
        newCar(id, name, description, price, img){
            this.id = id
            this.name = name
            this.description = description
            this.price = price
            this.img = img
        }
    }
    const list = document.getElementById('car-list')


    async function generateElements(){
        const cars = await getAllCars()
        for(let car of cars){
            let listItem = createItem(car.name, car.price, car.description, car.img)
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
            let carPrice = document.getElementById('car-description')
            let carImg = document.getElementById('car-img')

            let listItem = createItem(carName.value, carPrice.value, carDescription.value, carImg.value)
            let car = new Car(carName.value, carPrice.value, carDescription.value, carImg.value)
            createCar(car)
            list.append(listItem.item )
        })
    })
})()