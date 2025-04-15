const mongoose = require('mongoose')

const adopterSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Nome do adotante
  email: { type: String, required: true, unique: true }, //Email do adotante
  password: { type: String, required: true }, //Senha do adotante
  cpf: { type: String, required: true, unique: true }, //CPF do adotante
  phone: { type: String, required: true }, //Telefone do adotante
  profileImg: { type: String, required: true }, //Imagem de perfil do adotante
  address: { // //Endereço do adotante
    zipCode: { type: String, required: true }, //CEP
    street: { type: String, required: true }, //Rua
    number: { type: String, required: true }, //Número
    complement: { type: String }, //Complemento
    neighborhood: { type: String, required: true }, //Bairro
    city: { type: String, required: true }, //Cidade
    state: { type: String, required: true }, //Estado
  },
  registerDate: { type: Date, default: Date.now }, //Data de registro do adotante
  safeAdopter: { type: Boolean, default: false}, //Formulário de segurança preenchido
})

module.exports = mongoose.model('Adopter', usuarioSchema)
