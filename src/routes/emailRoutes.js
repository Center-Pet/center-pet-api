const express = require('express');
const router = express.Router();
const { sendWelcomeEmail } = require('../services/emailService');

// Rota para testar envio de boas-vindas para adotante
router.post('/welcome/adopter', async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ message: 'Informe email e nome.' });
    }
    try {
        await sendWelcomeEmail(email, name, false);
        res.status(200).json({ message: 'E-mail de boas-vindas para adotante enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
    }
});

// Rota para testar envio de boas-vindas para ONG
router.post('/welcome/ong', async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ message: 'Informe email e nome.' });
    }
    try {
        await sendWelcomeEmail(email, name, true);
        res.status(200).json({ message: 'E-mail de boas-vindas para ONG enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
    }
});

// Rota para enviar confirmação de exclusão para adotante
router.post('/delete/adopter', async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ message: 'Informe email e nome.' });
    }
    try {
        await sendDeleteEmail(email, name, false);
        res.status(200).json({ message: 'E-mail de confirmação de exclusão para adotante enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
    }
});

// Rota para enviar confirmação de exclusão para ONG
router.post('/delete/ong', async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ message: 'Informe email e nome.' });
    }
    try {
        await sendDeleteEmail(email, name, true);
        res.status(200).json({ message: 'E-mail de confirmação de exclusão para ONG enviado!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
    }
});

module.exports = router;