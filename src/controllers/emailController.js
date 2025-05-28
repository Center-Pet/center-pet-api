const { sendWelcomeEmail } = require('../services/emailServices');

exports.sendWelcome = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: 'Email e nome são obrigatórios.' });
    }

    await sendWelcomeEmail({ to: email, name });
    res.status(200).json({ message: 'Email de boas-vindas enviado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar email.', error: err.message });
  }
};