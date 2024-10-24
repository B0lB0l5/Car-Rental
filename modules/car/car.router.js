import { addCar, availableOfModel, avaOrRentedOfModel, deleteCar, getAllCars, getByModel, getSpecificCar, rentedOrModel, updateCar } from "./car.controllers.js"
import  {Router} from "express"

const carRouter = Router()

carRouter.post('/add-car',addCar)

carRouter.get('/get-all-cars',getAllCars)
carRouter.get('/models',getByModel)
carRouter.get('/:carId',getSpecificCar)
carRouter.get('/available/:model',availableOfModel)
carRouter.get('/rented-or-model/:model',rentedOrModel)
carRouter.get('/available-or-rented/:model',avaOrRentedOfModel)

carRouter.put('/update-car/:carId',updateCar)

carRouter.delete('/delete-car/:carId',deleteCar)

export default carRouter