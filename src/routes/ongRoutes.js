const express = require('express');
const router = express.Router();
const {
  createOng,
  updateOng,
  listOngs,
  deleteOng,
  getOngById
} = require('../controllers/ongController');

// Rota de registro inicial
router.post('/register', createOng);

// Rota de edição
router.patch('/editProfile/:id', updateOng);

// Rota de exclusão de ong
router.delete('/delete/:id', deleteOng);

// Rota para listar ongs
router.get('/', listOngs);

// Rota para puxar informações por ID
router.get('/:id', getOngById);


module.exports = router;