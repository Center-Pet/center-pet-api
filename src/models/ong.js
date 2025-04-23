const mongoose = require('mongoose')

const ongSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Nome da ONG
  description: { type: String, required: true }, //Descrição da ONG
  email: { type: String, required: true, unique: true }, //Email da ONG
  password: { type: String, required: true }, //Senha da ONG
  cnpj: { type: String, required: true, unique: true }, //CNPJ da ONG
  cpf: { type: String, required: true, unique: true }, //CPF do responsável
  colaborators: { type: Number, required: true }, //Número de colaboradores da ONG
  phone: { type: String, required: true}, //Telefone da ONG
  city: { type: String, required: true }, //Cidade da ONG
  profileImg: { type: String, required: true }, //Imagem de perfil da ONG
  socialMidia: { // //Redes sociais da ONG
    instagram: { type: String }, //Instagram
    facebook: { type: String }, //Facebook
    site: { type: String } //Site
  },
  pixKey: { type: String}, //Chave PIX da ONG
  verified: { type: Boolean, default: false }, //Verificado
  registerDate: { type: Date, default: Date.now }, //Data de registro da ONG
  petsRegisters: { type: Number, default: 0 }, //Número de pets cadastrados
  petsAdopted: { type: Number, default: 0 } //Número de pets adotados
})

module.exports = mongoose.model('Ong', ongSchema)
