const express = require('express');
const router = express.Router();
const { login, logout, forgotPassword, resetPassword } = require('../controllers/authController');

// Rota de login unificada para Adopter e Ong
router.post('/login', login);

// Rota de logout
router.post('/logout', logout);

// Rota para solicitar a redefinição de senha
router.post('/forgot-password', forgotPassword);

// Rota para redefinir a senha
router.post('/reset-password', resetPassword);

module.exports = router;