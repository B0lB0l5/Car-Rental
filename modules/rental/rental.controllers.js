import { db } from "../../database/dbConnection.js"
import { ObjectId } from "mongodb";
import moment from "moment"

const createRental = async (req, res) => {
    let { carId, customerId, returnDate } = req.body

    try {
        const customer = await db.collection('customers').findOne({ _id: new ObjectId(customerId) })

        if (!customer)
            return res.status(404).json({ message: "customer not found, please sign up" })
        if (!customer.is_loggedIn)
            return res.status(409).json({ message: "please login to complete this action" })

        const car = await db.collection("cars").findOne({ _id: new ObjectId(carId) });


        if (!car)
            return res.status(404).json({ message: "car not found" })

        if (car.rental_status == 'rented')
            return res.status(400).json({ message: "car already rented" })

        returnDate = moment(returnDate,"DD-MM-YYYY")
        
        if (!returnDate.isValid() )
            return res.status(409).json({message:"not a valid Date"})

        returnDate = moment(returnDate,"DD-MM-YYYY").toDate()

        const rentalDate = moment().toDate()

        const rental = { carId, customerId, rentalDate, returnDate }

        await db.collection("rentals").insertOne(rental)

        const result = await db.collection("cars").updateOne({ _id: new ObjectId(carId) }, { $set: { rental_status: "rented" } })

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateRental = async (req, res) => {
    try {
        let { returnDate } = req.body
        const rental = await db.collection("rentals").findOne({ _id: new ObjectId(req.params.id) })
        

        if (!rental)
            return res.status(404).json({ message: "not found" })

        returnDate = moment(returnDate,"DD-MM-YYYY")
        
        if (!returnDate.isValid() )
            return res.status(409).json({message:"not a valid Date"})

        returnDate = moment(returnDate,"DD-MM-YYYY").toDate()
        const currentDate = moment().toDate()

        if (returnDate <= currentDate)
            await db.collection("cars").updateOne({ _id: new ObjectId(rental.carId) }, { $set: { status: 'available' } });

        await db.collection("rentals").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { returnDate } });

        res.status(200).json({ message: 'Rental updated' })

    } catch (error) {
        res.status(500).json({ message:'error updating rental' });
        console.error(error);
        
    }
}
const deleteRental = async (req,res)=>{
    try {

        const rental = await db.collection("rentals").findOne({ _id: new ObjectId(req.params.id) })

        await db.collection('cars').updateOne({ _id: new ObjectId(rental.carId) },{ $set: { rental_status: 'available' } });
    
        await db.collection("rentals").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Rental deleted' });
    } catch (error) {
        res.status(500).json({  error: 'Error deleting rental' });
        console.error(error);

    }
}

const getAllRental= async (req,res)=>{
    try {
        const rentals = await db.collection('rentals').find().toArray()
        
        res.status(200).json({rentals})
    } catch (error) {
        res.status(500).json({  error: 'Error fetching rentals' });
        console.error(error);
    }
}

const getSpecificRental = async (req,res)=>{
    try {
        const rental = await db.collection("rentals").findOne({ _id: new ObjectId(req.params.id) })
        
        if(!rental)
            res.status(404).json({message:'rental not found'})

        res.status(200).json({rental})
        
    } catch (error) {
        res.status(500).json({  error: 'Error fetching rental' });
        console.error(error);
    }
}
export { 
    createRental,updateRental,deleteRental,getAllRental,getSpecificRental
}