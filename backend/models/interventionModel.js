import { mongoose } from 'mongoose'

const Schema = mongoose.Schema

const interventionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true })

const Intervention = mongoose.model('Intervention', interventionSchema)

export default Intervention
