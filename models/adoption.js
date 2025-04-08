const mongoose = require('mongoose')

const adoptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true },
  status: {
    type: String,
    enum: ['available', 'requestReceived', 'underEvaluation', 'inProgress', 'canceled', 'transporting', 'inAdjustment', 'completed', 'return'],
    default: 'available'
  },
  requestDate: { type: Date, default: Date.now },
  transportationDate: Date,
  startDateAdjustment: Date,
  endDateAdjustment: Date
})

module.exports = mongoose.model('Adoption', adoptionSchema)
