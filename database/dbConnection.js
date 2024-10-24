import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://localhost:27017/')

client.connect().then(()=>{
    console.log('connected to database successfully');
    
}).catch(()=>{
    console.error('database error');
    
})

const db = client.db('offline')

export {db}