const Router = require('express')
const router = new Router()
const carController = require('../controllers/car.controller.js')

router.post('/car', carController.createCar)
router.get('/car', carController.getAllCars)
router.get('/car/:id', carController.getCar)
router.put('/car', carController.updateCar)
router.delete('/car/:id', carController.deleteCar)

module.exports = router