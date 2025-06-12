const Adopter = require('../models/adopter');
const Ong = require('../models/ong');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/tokenBlacklist');
const crypto = require('crypto');
const PasswordResetToken = require('../models/passwordResetToken');
const { sendResetPasswordEmail } = require('../services/emailService');

/**
 * Login unificado para Adopter e Ong.
 * Recebe { email, password }.
 * Procura primeiro em Adopter, depois em Ong.
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  // Procura primeiro em Adopter
  let user = await Adopter.findOne({ email });
  let userType = 'Adopter';

  // Se não encontrar, procura em Ong
  if (!user) {
    user = await Ong.findOne({ email });
    userType = 'Ong';
  }

  if (!user) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }

  // Compara a senha informada com o hash salvo
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: user._id, type: userType, role: user.role || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Remove a senha do objeto de resposta
  const { password: _, ...userData } = user.toObject();

  res.status(200).json({
    message: 'Login realizado com sucesso.',
    token,
    user: userData,
    userType
  });
}

// Rota de logout: adiciona o token à blacklist
async function logout(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token não fornecido.' });
  }

  tokenBlacklist.add(token);
  res.status(200).json({ message: 'Logout realizado com sucesso.' });
}

// Solicitar reset de senha
async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Informe o email." });

  // Procura usuário (adotante ou ONG)
  let user = await Adopter.findOne({ email });
  let userType = 'Adopter';
  if (!user) {
    user = await Ong.findOne({ email });
    userType = 'Ong';
  }
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  // Gera token e salva
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

  await PasswordResetToken.deleteMany({ userId: user._id }); // Remove tokens antigos
  await PasswordResetToken.create({
    userId: user._id,
    userType,
    token,
    expiresAt
  });

  // Link para o frontend
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&type=${userType.toLowerCase()}`;
  // const resetLink = `https://centerpet.netlify.app/reset-password?token=${token}&type=${userType.toLowerCase()}`; QUANDO VOLTAR PARA PRODUÇÃO DESCOMENTAR ESSE E COMENTAR O DE LOCALHOST

  await sendResetPasswordEmail(user.email, user.fullName || user.name, resetLink);

  res.status(200).json({ message: "E-mail de redefinição enviado!" });
}

// Redefinir senha
async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "Token e nova senha obrigatórios." });

  const resetToken = await PasswordResetToken.findOne({ token });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }

  // Atualiza senha
  let userModel = resetToken.userType === 'Adopter' ? Adopter : Ong;
  const user = await userModel.findById(resetToken.userId);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  // Remove o token usado
  await PasswordResetToken.deleteOne({ _id: resetToken._id });

  res.status(200).json({ message: "Senha redefinida com sucesso!" });
}

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword,
};