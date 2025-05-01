const Adopter = require('../models/adopter');
const Ong = require('../models/ong');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = { login };