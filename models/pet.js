const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  month: { type: Number, required: true },
  specie: { type: String, required: true },
  breed: { type: String },
  gender: { type: String, enum: ['Macho', 'Fêmea'], required: true },
  size: { type: String, enum: ['Pequeno', 'Médio', 'Grande'], required: true },
  description: { type: String },
  image: [String],
  health: {
    castrated: { type: Boolean, required: true },
    vaccinated: { type: Boolean, required: true },
    dewormed: { type: Boolean, required: true },
    specialCondition: Boolean
  },
  available: { type: Boolean, default: true },
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true },
  registerDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Pet', petSchema)
