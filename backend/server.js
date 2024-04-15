import { MongoClient } from 'mongodb'
import express from 'express'
import 'dotenv/config'


const mongoClient = new MongoClient(process.env.MONGO_CLIENT)
const mongoConnection = await mongoClient.connect(process.env.MONGO_URI)
const mongoDatabase = mongoConnection.db('mern-rxdb-test')
const mongoCollection = mongoDatabase.collection('companies')

// express app
const app = express()

// middleware
app.use(express.json())

// routes

// running app
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
