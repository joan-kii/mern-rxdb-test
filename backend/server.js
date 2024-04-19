import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import mongoDbOn from './db/mongoConfig.js'
import teamRouter from './routes/teamRoute.js'
import rxdbRouter from './routes/rxdbRoute.js'

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
mongoDbOn().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })
})
