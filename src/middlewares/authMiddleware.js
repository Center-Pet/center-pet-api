const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/tokenBlacklist');

/**
 * Middleware para proteger rotas autenticadas.
 * Verifica o token JWT no header Authorization.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  // Verifica se o token está na blacklist
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Token inválido (logout).' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;