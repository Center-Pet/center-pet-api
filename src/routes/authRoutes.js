const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');

// Rota de login unificada para Adopter e Ong
router.post('/login', login);

// Rota de logout
router.post('/logout', logout);

module.exports = router;