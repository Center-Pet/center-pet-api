const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome do animal
  type: { type: String, enum: ['Cachorro', 'Gato'], required: true }, // Espécie
  age: { type: String, enum: ['Filhote', 'Jovem', 'Adulto', 'Idoso'], required: true }, // Idade
  breed: { type: String }, // Raça
  gender: { type: String, enum: ['Macho', 'Fêmea'], required: true }, // Gênero
  size: { type: String, enum: ['Pequeno', 'Médio', 'Grande'], required: true }, // Porte
  coat: { type: String, enum: ['Curta', 'Média', 'Longa'], required: true }, // Pelagem
  description: { type: String }, // Biografia do pet
  image: [String], // Imagens do pet
  health: {
    castrated: { type: Boolean, required: true }, // Castrado
    vaccinated: { type: Boolean, required: true }, // Vacinado
    dewormed: { type: Boolean, required: true }, // Vermifugado
    specialCondition: { type: String }, // Condição especial
  },
  waitingTime: { type: String }, // Tempo de espera
  available: { type: Boolean, default: true }, // Disponível para adoção
  adopted: { type: Boolean, default: false }, // Adotado
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true }, // ID da ONG responsável
  location: { type: String, required: true }, // Localização
  registerDate: { type: Date, default: Date.now }, // Data de registro
},{ collection: 'Pets' });

module.exports = mongoose.model('Pet', petSchema);
