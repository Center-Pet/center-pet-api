const mongoose = require('mongoose')

const ongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pixKey: String,
  phone: { type: String, required: true},
  city: { type: String, required: true },
  profileImg: { type: String, required: true },
  socialMidia: {
    instagram: String,
    facebook: String,
    site: String
  },
  verified: { type: Boolean, default: false },
  registerDate: { type: Date, default: Date.now },
  petsRegisters: { type: Number, default: 0 },
  petsAdopted: { type: Number, default: 0 }
})

module.exports = mongoose.model('Ong', ongSchema)
