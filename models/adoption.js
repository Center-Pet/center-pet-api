const mongoose = require('mongoose')

const adoptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //ID do usuário que está adotando
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }, //ID do pet que está sendo adotado
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ong', required: true }, //ID da ONG responsável pelo pet
  status: { type: String, //Status da adoção
    enum: [
    'requestReceived', //Solicitação recebida
    'underEvaluation', //Em avaliação
    'inProgress', //Em andamento
    'canceled', //Cancelada
    'transporting', //Transporte
    'inAdjustment', //Adaptação
    'completed', //Concluída
    'return'], //Retorno
    required: true,
    default: 'available'
  },
  requestDate: { type: Date, default: Date.now }, //Data da solicitação
  transportationDate: { type: Date }, //Data do transporte
  startDateAdjustment: { type: Date }, //Data de início do Adaptação
  endDateAdjustment: { type: Date }, //Data de término do Adaptação
})

module.exports = mongoose.model('Adoption', adoptionSchema)
