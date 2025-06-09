const express = require('express');
const router = express.Router();
const {
  createAdopter,
  updateSafeAdopter,
  listAdopters,
  updateAdopterProfile,
  deleteAdopter,
  getAdopterById
} = require('../controllers/adopterController');

// Rota de registro inicial (nome, CPF, e-mail, senha)
router.post('/register', createAdopter);

// Rota de atualização do formulário completo
router.patch('/updateSafeAdopter', updateSafeAdopter);

// Rota para listar todos os adotantes
router.get('/', listAdopters);

// Rota para editar perfil do adotante
router.patch('/editProfile/:id', updateAdopterProfile);

// Rota para deletar adotante (pode ser pelo ID ou e-mail)
router.delete('/delete/:adopterId', deleteAdopter);

// Rota para puxar informações por ID
router.get('/:adopterId', getAdopterById);


module.exports = router;
