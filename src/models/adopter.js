const mongoose = require('mongoose')

const adopterSchema = new mongoose.Schema({
  //Informações de cadastro
  fullName: { type: String, required: true }, //Nome do adotante
  email: { type: String, required: true, unique: true }, //Email do adotante
  password: { type: String, required: true }, //Senha do adotante
  cpf: { type: String, required: true, unique: true }, //CPF do adotante
  cpfHash: { type: String, required: true, unique: true},
  registerDate: { type: Date, default: Date.now }, //Data de registro do adotante


  //Informações do formulário
  //Informações pessoais
  birth: { type: Date}, //Data de nascimento do adotante
  phone: { type: String}, //Telefone do adotante
  profession: { type: String}, //Profissão do adotante
  cep: { type: String}, //CEP do adotante
  state: { type: String }, // Estado do adotante
  street: { type: String}, //Rua do adotante
  number: { type: String}, //Número da casa do adotante
  neighborhood: { type: String}, //Bairro do adotante
  complement: { type: String}, //Complemento do endereço do adotante
  city: { type: String}, //Cidade do adotante

  
  //Sobre o ambiente
  housingType: { type: String, enum:['Casa', 'Apartamento', 'Sítio/Chácara']}, //Tipo de casa do adotante (casa, apartamento, etc.)
  homeOwnership: { type: String, enum:['Próprio', 'Alugado']}, //Tipo de moradia do adotante (alugada, própria, financiada)
  petsAllowed: { type: Boolean}, //Permissão para ter animais no local
  homeSafety: {type: Boolean}, //Casa segura para o animal (cercada, portão, etc.)
  numberOfHouseholdMembers: { type: Number}, //Número de pessoas na casa do adotante
  allergy: { type: Boolean}, //Alguém na casa tem alergia a animais
  allergyDetails: { type: String}, //Como vão lidar com isso(se houver)
  familyAgreement: { type: Boolean}, //Todos da casa concordam com a adoção
  familyAgreementDetails: { type: String}, //Como vão lidar com isso(se houver)
  
  //Experiência com animais
  hasOrHadPets: { type: String,enum: ["Já tive e tenho", "Já tive, mas não tenho nenhum no momento",'Será o meu primeiro'],},
  petOutcome: { type: String, enum:['Faleceu de causas naturais','Fugiu','Foi doado','Outro']}, //O que aconteceu com o último animal que teve
  petOutcome1: { type: String, enum:['Faleceu de causas naturais','Fugiu','Foi doado','Outro']}, //O que aconteceu com o último animal que teve
  otherOutcome: { type: String}, //Outro motivo (se houver)
  currentPetsDetails: { type: String}, //Detalhes dos animais que possui atualmente (nome, idade, raça, etc.)


  //Comportamento e rotina
  reasonToAdopt: { type: String}, //Motivo da adoção
  expectedPetBehavior: { type: String}, //Comportamento esperado do animal
  howHandleUndesiredBehavior: { type: String}, //Como lidaria com comportamentos indesejados do animal
  willingToTrain: { type: Boolean}, //Disposição para treinar o animal
  petAloneHoursPerDay: { type: String}, //Horas que o animal ficará sozinho por dia
  sleepingPlace: { type: String}, //Onde o animal dormirá

  //Segurança e cuidados
  keepVaccinesUpToDate: { type: Boolean}, //Vacinas em dia
  regularVetVisits: { type: Boolean}, //Visitas regulares ao veterinário
  financialConditions: { type: Boolean}, //Condições financeiras para cuidar do animal
  awareOfLaw: { type: Boolean}, //Ciente da Lei 9605/98 (Lei de Crimes Ambientais)
  commitToNeverAbandon: { type: Boolean}, //Compromisso de nunca abandonar o animal
  returnToOng: { type: Boolean}, //Devolver o animal para a ONG se não puder cuidar mais

  //Conscientização
  awareOfResponsibilities: { type: Boolean}, //Ciente das responsabilidades da adoção
  finalDeclarationAgreement: { type: Boolean} ,//Declaração final de compromisso com a adoção

  safeAdopter: { type: Boolean, default: false}, //Formulário de segurança preenchido


  //Informações adicionais
  profileImg: { type: String}, //Imagem de perfil do adotante
  description: { type: String, maxLength: 150}, //Descrição do adotante
}, { collection: 'Adopters' });


module.exports = mongoose.model('Adopter', adopterSchema)
