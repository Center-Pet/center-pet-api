const mongoose = require('mongoose')

const adoptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adopter', required: true }, // Alterado de 'User' para 'Adopter'
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true },
  status: { type: String,
    enum: [
    'requestReceived',
    'inProgress',
    'rejected',
    'inAdjustment',
    'completed',
    'return'],
    required: true
  },
  requestDate: { type: Date, default: Date.now },
}, {
  collection: 'Adoptions'
})

module.exports = mongoose.model('Adoption', adoptionSchema)
