const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Nome do animal
  type: { type: String, enum: ['Cachorro', 'Gato'], required: true }, //Tipo de animal
  age: { type: String, enum: ['Filhote', 'Jovem', 'Adulto', 'Idoso'], required: true }, //Idade
  breed: { type: String }, //Raça
  gender: { type: String, enum: ['Macho', 'Fêmea'], required: true }, //Gênero
  size: { type: String, enum: ['Pequeno', 'Médio', 'Grande'], required: true }, //Tamanho
  coat: { type: String, enum: ['Curto', 'Médio', 'Longo'], required: true }, //Pelagem
  description: { type: String }, //Descrição/História do animal
  image: [String], //Imagem do animal
  health: { //Saúde do animal
    castrated: { type: Boolean, required: true }, //Castrado
    vaccinated: { type: Boolean, required: true }, //Vacinado
    dewormed: { type: Boolean, required: true }, //Vermifugado
    specialCondition: { type: Boolean, required: true }, //Condição especial
    specialConditionDesc: { type: String } //Descrição da condição especial (Medicação Contínua, Cego, Surdo)
  },
  available: { type: Boolean, default: true }, //Disponível para adoção
  adopted: { type: Boolean, default: false }, //Adotado
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true }, //ID da ONG responsável pelo animal
  location: { type: String, required: true }, //Localização do animal
  registerDate: { type: Date, default: Date.now }, //Data de registro do animal
  priority: { type: String, enum: ['Urgente', 'Adoção Especial', 'Resgatado Recentemente'] }, //Prioridade do animal
  behavior: { type: String, enum: ['Dócil', 'Tímido', 'Ativo', 'Sociável'] }, //Comportamento do animal
  adoptionDate: { type: Date }, //Data da adoção
})

module.exports = mongoose.model('Pet', petSchema)
