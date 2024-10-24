import { db } from "../../database/dbConnection.js"
import { ObjectId } from "mongodb";


const addCar = async (req, res) => {
    const { name, model } = req.body
    try {
        const rental_status = 'available'
        const rental = { name, model, rental_status }
        await db.collection('cars').insertOne(rental)
        return res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: "error adding car" })
        console.error(error);

    }
}

const updateCar = async (req, res) => {
    const carId = new ObjectId(req.params.carId)
    try {
        const updatedCar = await db.collection('cars').updateOne({ _id: carId }, { $set: req.body })
        if (!updatedCar)
            return res.status(404).json({ message: 'not found' })
        return res.status(200).json({ message: "success", updatedCar })
    } catch (error) {
        res.status(500).json({ message: "error updating car" })
        console.error(error);
    }
}

const getAllCars = async (req, res) => {
    try {

        const allCars = await db.collection('cars').find().toArray()

        res.status(200).json({ message: 'success!', allCars });

    } catch (error) {
        res.status(500).json({ message: "error fetching cars" })
        console.error(error);
    }
}

const getSpecificCar = async (req, res) => {
    try {
        const carId = new ObjectId(req.params.carId)
        const car = await db.collection('cars').findOne({ _id: carId })

        if (!car)
            return res.status(404).json({ message: 'not found' })
        res.status(200).json({ message: 'success!', car });


    } catch (error) {
        res.status(500).json({ error: 'error fetching this car' })
        console.error(error);
    }
}
const deleteCar = async (req, res) => {
    try {

        const carId = new ObjectId(req.params.carId)
        const specificCustomer = await db.collection('cars').findOne({ _id: carId })

        if (!specificCustomer)
            return res.status(404).json({ message: "not found" })

        const deleted = await db.collection('cars').deleteOne({ _id: carId })

        return res.status(200).json({ message: "deleted successfully", deleted })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getByModel = async (req, res) => {
    try {
        const model = req.query.model.split(',')

        const cars = await db.collection("cars").find({ model: { $in: model } }).toArray()
        if (!cars)
            return res.status(404).json({ message: "no cars of this model" })

        res.status(200).json({ cars })
    } catch (error) {
        res.status(500).json({ error: 'error fetching' })
        console.error(error);

    }
}

const availableOfModel = async (req, res) => {
    try {
        const cars = await db.collection("cars").find({
            model: req.params.model,
            rental_status: 'available'
        }).toArray();

        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: `error fetching available cars of ${req.params.model}` })
        console.error(error);
    }
}

const rentedOrModel = async (req, res) => {
    try {
        const cars = await db.collection("cars").find({
            $or: [
                { rental_status: 'rented' },
                { model: req.params.model }
            ]
        }).toArray();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by rental status or model' });
        console.error(error);
    }
}
const avaOrRentedOfModel = async (req, res) => {
    try {
        const cars = await db.collection("cars").find({
            $or: [
                {rental_status: 'available' },
                { model: req.params.model, rental_status: 'rented' }
            ]
        }).toArray();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by status or model' });
    }
}
export {
    addCar, updateCar, getAllCars,
    getSpecificCar, deleteCar, getByModel,
    availableOfModel, rentedOrModel,
    avaOrRentedOfModel
}
