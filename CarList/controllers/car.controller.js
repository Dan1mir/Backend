const db = require('../db.js')

class CarController{
    async createCar(req, res){
        const {name, description, price, img} = req.body
        const newCar = await db.query(`INSERT INTO cars (name, description, price, img) VALUES ($1, $2, $3, $4) RETURNING *`, [name, description, price, img])
        res.json(newCar.rows[0])
                        
    }
    async getAllCars(req, res){
        const cars = await db.query(`SELECT id, name, description, price, img FROM cars`) // или SELECT * FROM для всех
        res.json(cars.rows)
    }
    async getCar(req, res){
        const id = req.params.id
        const car = await db.query(`SELECT * FROM cars WHERE id = $1`, [id])
        res.json(car.rows)
    }
    async updateCar(req, res){
        const {id, name, description, price, img} = req.body
        const car = await db.query(`UPDATE cars SET name = $1, description = $2, price = $3, img= $4 WHERE id= $5 RETURNING *`, [name, description, price, img, id])
        res.json(car.rows)
    }
    async deleteCar(req, res){
        const id = req.params.id
        const deleteCar = await db.query(`DELETE FROM cars WHERE id=$1`, [id])
        res.json(deleteCar.rows)
    }
}

module.exports = new CarController()