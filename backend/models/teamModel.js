import { mongoose } from 'mongoose'

const Schema = mongoose.Schema

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  n_teammates: {
    type: Number,
    required: true
  },
  interventionsId: [{
    type: Schema.Types.ObjectId,
    ref: 'Intervention',
    required: true
  }]
}, { timestamps: true })

const Team = mongoose.model('Team', teamSchema)

export default Team
