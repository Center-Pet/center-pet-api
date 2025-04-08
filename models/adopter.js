const mongoose = require('mongoose')

const adopterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    state: { type: String, required: true },
    city: { type: String, required: true },
  },
  registerDate: { type: Date, default: Date.now },
  safeAdopter: { type: Boolean, default: false}
})

module.exports = mongoose.model('Adopter', usuarioSchema)
