import { ObjectId } from "mongodb";
import { db } from "../../database/dbConnection.js"
import bcrypt from 'bcrypt';


const signup = async (req, res) => {
    let { email, password } = req.body
    try {
        const emailCheck = await db.collection('customers').findOne({ email: email }, {})
        if (emailCheck)
            return res.status(200).json({ message: 'E-mail already exists' })


        const hashedPass = await bcrypt.hash(password, 8)
        req.body.password = hashedPass

        await db.collection('customers').insertOne(req.body)
        const customer = await db.collection('customers').findOneAndUpdate({ email: email }, { $set: { is_loggedIn: false } })


        return res.status(200).json({ message: "success", customer })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const logIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const customer = await db.collection('customers').findOne({ email: email })


        if (!customer)
            return res.status(200).json({ message: 'please signup first' })
        if (typeof password !== 'string') {
            return res.status(400).json({ message: 'Password must be string' });
        }

        const checkPass = await bcrypt.compare(password, customer.password)

        if (!checkPass)
            return res.status(401).json({ message: 'incorrect password' })

        await db.collection('customers').updateOne({ email: email }, { $set: { is_loggedIn: true } })

        res.status(200).json({ message: 'Login successful!' });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getAllcustomers = async (req, res) => {
    try {

        const allCustomers = await db.collection('customers').find().toArray()

        res.status(200).json({ message: 'success!', allCustomers });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getSpecificCustomer = async (req, res) => {
    try {
        const customerId = new ObjectId(req.params.customerId)
        const specificCustomer = await db.collection('customers').findOne({ _id: customerId })

        if (!specificCustomer)
            return res.status(500).json({ message: "not found" })

        res.status(200).json({ message: 'success!', specificCustomer });


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customerId = new ObjectId(req.params.customerId)
        const { email, password } = req.body
        const logInStatus = await db.collection('customers').findOne({ _id: customerId, is_loggedIn: true }, {})
        console.log(logInStatus);
        if (!logInStatus)
            return res.status(409).json({ message: "login to update" })

        const emailCheck = await db.collection('customers').findOne({ email: email }, {})

        if (emailCheck)
            return res.status(200).json({ message: 'E-mail already exists or its the same e-mail' })

        const hashedPass = await bcrypt.hash(password, 8)
        req.body.password = hashedPass



        const specificCustomer = await db.collection('customers').updateOne({ _id: customerId }, { $set: req.body })

        if (!specificCustomer)
            return res.status(500).json({ message: "not found" })

        res.status(200).json({ message: 'success!', specificCustomer });

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

const deleteCustomer = async (req,res)=>{
    try {
        
    const customerId = new ObjectId(req.params.customerId)
    const specificCustomer = await db.collection('customers').findOne({ _id: customerId })

    if(!specificCustomer)
        return res.status(404).json({message:"not found"})

    const deleted = await db.collection('customers').deleteOne({_id:customerId})
    
    return res.status(200).json({message:"deleted successfully", deleted})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
export { signup, logIn, getAllcustomers, getSpecificCustomer, updateCustomer, deleteCustomer }