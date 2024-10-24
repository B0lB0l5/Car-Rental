import { Router } from "express";
import { createRental, deleteRental, getAllRental, getSpecificRental, updateRental } from "./rental.controllers.js";
const rentalRouter = Router()


rentalRouter.post('/create-rental',createRental)

rentalRouter.put('/:id',updateRental)

rentalRouter.delete('/:id',deleteRental)

rentalRouter.get('/',getAllRental)
rentalRouter.get('/:id',getSpecificRental)


export default rentalRouter