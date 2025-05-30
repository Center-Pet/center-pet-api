const mongoose = require('mongoose')

const ongSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Nome da ONG
  description: { type: String}, //Descrição da ONG
  email: { type: String, required: true, unique: true }, //Email da ONG
  password: { type: String, required: true }, //Senha da ONG
  cnpj: { type: String, required: function() { return this.role === 'ONG'; }, sparse: true}, //CNPJ da ONG (obrigatório para ONGs)
  cpf: { type: String, required: function() { return this.role === 'Projeto' || this.role === 'Protetor'; }, sparse: true}, //CPF do responsável (obrigatório para Projetos e Protetores)
  cnpjHash: { type: String, unique: true, sparse: true }, // Hash determinístico do CNPJ para verificação de unicidade
  cpfHash: { type: String, unique: true, sparse: true },  // Hash determinístico do CPF para verificação de unicidade
  role: { type: String, enum: ['ONG', 'Projeto', 'Protetor'], required: true }, // Tipo de organização
  collaborators: { type: Number, required: function() { return this.role === 'Projeto'; }, default: 0 }, //Número de colaboradores (obrigatório para Projetos)
  phone: { type: String, required: true}, //Telefone da ONG
  address: { // Endereço completo
    uf: { type: String, required: true }, // Unidade Federativa (Estado) da ONG
    city: { type: String, required: true }, // Cidade da ONG
    street: { type: String, required: true }, // Rua (opcional)
    number: { type: String, required: true }, // Número (opcional)
    neighborhood: { type: String, required: true }, // Bairro (opcional)
    cep: { type: String, required: true }, // CEP (opcional)
    complement: { type: String } // Complemento (opcional)
  },
  profileImg: { type: String, required: true }, //Imagem de perfil da ONG
  socialMidia: { // Redes sociais da ONG
    instagram: { type: String }, //Instagram
    facebook: { type: String }, //Facebook
    site: { type: String } //Site
  },
  pixKey: { type: String }, //Chave PIX da ONG
  verified: { type: Boolean, default: false }, //Verificado
  registerDate: { type: Date, default: Date.now }, //Data de registro da ONG
  petsRegisters: { type: Number, default: 0 }, //Número de pets cadastrados
  petsAdopted: { type: Number, default: 0 } //Número de pets adotados
}, { collection: 'Ongs' });

module.exports = mongoose.model('Ong', ongSchema)
