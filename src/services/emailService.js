// services/emailService.js
const nodemailer = require("nodemailer");
const welcomeAdopterTemplate = require("../emailTemplates/welcomeAdopter");
const welcomeOngTemplate = require("../emailTemplates/welcomeOng");
const resetPasswordTemplate = require("../emailTemplates/resetPassword");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um e-mail de boas-vindas para o usuário.
 * @param {string} to - E-mail do destinatário
 * @param {string} name - Nome do usuário
 * @param {boolean} isONG - true para ONG, false para adotante
 */
async function sendWelcomeEmail(to, name, isONG = false) {
  const subject = isONG
    ? "Bem-vinda à Center Pet, ONG querida!"
    : "Bem-vindo à Center Pet, herói dos pets!";

  const html = isONG
    ? welcomeOngTemplate(name)
    : welcomeAdopterTemplate(name);

  const mailOptions = {
    from: `"Center Pet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ E-mail enviado para ${to}`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}

/**
 * Envia um e-mail de redefinição de senha para o usuário.
 * @param {string} to - E-mail do destinatário
 * @param {string} name - Nome do usuário
 * @param {string} resetLink - Link para redefinição de senha
 */
async function sendResetPasswordEmail(to, name, resetLink) {
  const subject = "Redefinição de senha - Center Pet";
  const html = resetPasswordTemplate(name, resetLink);

  const mailOptions = {
    from: `"Center Pet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ E-mail de reset enviado para ${to}`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de reset:", error);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
