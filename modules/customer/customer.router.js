import  {Router} from "express"
import { deleteCustomer, getAllcustomers, getSpecificCustomer, logIn, signup, updateCustomer } from "./customer.controllers.js"

const customerRouter= Router()

customerRouter.post("/",signup)
customerRouter.post("/signin",logIn)
customerRouter.get("/all-customers",getAllcustomers)
customerRouter.get("/customer/:customerId",getSpecificCustomer)
customerRouter.put("/customer/:customerId",updateCustomer)
customerRouter.delete("/customer/:customerId",deleteCustomer)


export default customerRouter