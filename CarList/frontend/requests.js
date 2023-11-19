export async function getAllCars(){
    const response = await fetch('http://localhost:8080/car', {
        method: 'GET'
    })
    const result = await response.json()
    console.log(result)
    return result
}
export async function getCar(id){
    const response = await fetch('http://localhost:8080/car/' + id, {
        method: 'GET'
    })
    const result = await response.json()
    console.log(result)
    return result
}
export async function createCar(car){
    await fetch('http://localhost:8080/car', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: car.name,
            description: car.description,
            price: car.price,
            img: car.img
        })
    })
}
export async function deleteCar(id){
    await fetch('http://localhost:8080/car/' + id, {
        method: 'DELETE'
    })
}
export async function updateCar(car){
    await fetch('http://localhost:8080/car', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: car.id,
            name: car.name,
            description: car.description,
            price: car.price,
            img: car.img
        })
    })
}
