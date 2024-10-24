import express from 'express'
import carRouter from './modules/car/car.router.js'
import customerRouter from './modules/customer/customer.router.js'
import rentalRouter from './modules/rental/rental.router.js'
const app = express()
const port = 3000

app.use(express.json())

app.use('/',customerRouter)

app.use('/cars',carRouter )

app.use('/rentals',rentalRouter)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))