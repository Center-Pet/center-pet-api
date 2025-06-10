const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/tokenBlacklist');

/**
 * Middleware para proteger rotas autenticadas.
 * Verifica o token JWT no header Authorization.
 */
function authenticateToken(req, res, next) {
  try {
    // Verifica se o header Authorization existe
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('❌ Header Authorization não encontrado');
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Extrai o token do header (formato: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('❌ Token não encontrado no header');
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Verifica se o token está na blacklist
    if (tokenBlacklist.has(token)) {
      console.log('❌ Token está na blacklist');
      return res.status(401).json({ message: 'Token inválido (logout).' });
    }

    // Verifica e decodifica o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Erro ao verificar token:', err.message);
        return res.status(403).json({ message: 'Token inválido.' });
      }

      // Adiciona os dados do usuário ao objeto request
      req.user = {
        id: decoded.id,
        type: decoded.type,
        role: decoded.role || null
      };

      console.log('✅ Token válido para usuário:', {
        id: req.user.id,
        type: req.user.type,
        role: req.user.role
      });
      
      next();
    });
  } catch (error) {
    console.error('❌ Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno ao verificar autenticação.' });
  }
}

module.exports = authenticateToken;