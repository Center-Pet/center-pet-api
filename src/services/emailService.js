const nodemailer = require('nodemailer');

// Configuração do transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para enviar email de boas-vindas
async function sendWelcomeEmail({ to, name }) {
  if (!isValidEmail(to)) throw new Error('Email inválido');

  const mailOptions = {
    from: `"CenterPet" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Bem-vindo(a) ao CenterPet, ${name}!`,
    html: `
      <h2>Bem-vindo(a) ao CenterPet!</h2>
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Seu cadastro foi realizado com sucesso. Agora você faz parte da nossa comunidade!</p>
      <p>Qualquer dúvida, estamos à disposição.</p>
      <p>Equipe CenterPet</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };