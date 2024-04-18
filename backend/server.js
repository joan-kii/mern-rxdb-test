import { MongoClient } from 'mongodb'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { teamRouter } from './routes/teamRoute'
import { rxdbRouter} from './routes/rxdbRoute'

// seguir aquí

const mongoClient = new MongoClient(process.env.MONGO_CLIENT)
const mongoConnection = await mongoClient.connect(process.env.MONGO_URI)
const mongoDatabase = mongoConnection.db('mern-rxdb-test')
const teamsCollection = mongoDatabase.collection('teams')
const corsOptions = {
  origin: `${process.env.CLIENT}`
}

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors(corsOptions))

// routes
app.use('/team', teamRouter)
app.use('/db', rxdbRouter)

// running app
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
