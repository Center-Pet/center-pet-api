// services/emailService.js
const nodemailer = require("nodemailer");
const welcomeAdopterTemplate = require("../emailTemplates/welcomeAdopter");
const welcomeOngTemplate = require("../emailTemplates/welcomeOng");
const resetPasswordTemplate = require("../emailTemplates/resetPassword");
const adoptionRequestTemplate = require("../emailTemplates/adoptionRequest");
const adoptionApprovedTemplate = require("../emailTemplates/adoptionApproved");
const adoptionRejectedTemplate = require("../emailTemplates/adoptionRejected");
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
    ? "Bem-vinda à Center Pet, vamos achar um lar para seu pet!"
    : "Bem-vindo à Center Pet, vamos achar um amigo?";

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

/**
 * Envia e-mail de pedido de adoção para a ONG.
 * @param {string} to - E-mail da ONG
 * @param {string} adopterName - Nome do adotante
 * @param {string} petName - Nome do pet
 */
async function sendAdoptionRequestEmail(to, adopterName, petName, petId, userId, ongId, adoptionLink) {
  console.log("Chamando sendAdoptionRequestEmail com:", {
    to, adopterName, petName, petId, userId, ongId, adoptionLink
  });

  const subject = "Novo pedido de adoção recebido!";
  const html = adoptionRequestTemplate(adopterName, petName, adoptionLink);

  const mailOptions = {
    from: `"Center Pet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Pedido de adoção enviado para ${to}`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de pedido de adoção:", error, {
      to, adopterName, petName, petId, userId, ongId, adoptionLink
    });
  }
}

/**
 * Envia e-mail de aprovação de adoção para o adotante.
 * @param {string} to - E-mail do adotante
 * @param {string} adopterName - Nome do adotante
 * @param {string} petName - Nome do pet
 * @param {Object} ongContact - Dados de contato da ONG
 * @param {string} ongContact.whatsapp - Número do WhatsApp da ONG
 * @param {string} ongContact.email - E-mail da ONG
 * @param {string} ongContact.instagram - Instagram da ONG
 * @param {string} ongContact.facebook - Facebook da ONG
 */
async function sendAdoptionApprovedEmail(to, adopterName, petName, ongContact) {
  console.log('📧 Iniciando envio de e-mail de aprovação de adoção:', {
    to,
    adopterName,
    petName,
    ongContact
  });

  const subject = "Adoção aprovada!";
  const html = adoptionApprovedTemplate(adopterName, petName, ongContact);

  const mailOptions = {
    from: `"Center Pet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    console.log('📧 Configurações do e-mail de aprovação:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      template: {
        adopterName,
        petName,
        ongContact
      }
    });

    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail de aprovação de adoção enviado com sucesso para ${to}`);
  } catch (error) {
    console.error('❌ Erro detalhado ao enviar e-mail de aprovação de adoção:', {
      error: error.message,
      stack: error.stack,
      mailOptions: {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      },
      template: {
        adopterName,
        petName,
        ongContact
      }
    });
    throw error; // Re-throw para ser tratado pelo controller
  }
}

/**
 * Envia e-mail de recusa de adoção para o adotante.
 * @param {string} to - E-mail do adotante
 * @param {string} adopterName - Nome do adotante
 * @param {string} petName - Nome do pet
 */
async function sendAdoptionRejectedEmail(to, adopterName, petName) {
  console.log('📧 Iniciando envio de e-mail de rejeição de adoção:', {
    to,
    adopterName,
    petName
  });

  const subject = "Adoção não aprovada";
  const html = adoptionRejectedTemplate(adopterName, petName);

  const mailOptions = {
    from: `"Center Pet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    console.log('📧 Configurações do e-mail de rejeição:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      template: {
        adopterName,
        petName
      }
    });

    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail de rejeição de adoção enviado com sucesso para ${to}`);
  } catch (error) {
    console.error('❌ Erro detalhado ao enviar e-mail de rejeição de adoção:', {
      error: error.message,
      stack: error.stack,
      mailOptions: {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      },
      template: {
        adopterName,
        petName
      }
    });
    throw error; // Re-throw para ser tratado pelo controller
  }
}

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendAdoptionRequestEmail,
  sendAdoptionApprovedEmail,
  sendAdoptionRejectedEmail,
};
