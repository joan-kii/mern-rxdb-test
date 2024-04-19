import mongoose from 'mongoose'
import 'dotenv/config'

const mongoDbOn = async () => {
  return mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.log('Not connected to MongoDb!', err))
}

export default mongoDbOn
