const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Rota de login unificada para Adopter e Ong
router.post('/login', login);

module.exports = router;