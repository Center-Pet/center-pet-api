// Blacklist simples em memória (para produção, use Redis ou banco de dados)
const blacklist = new Set();

function add(token) {
  blacklist.add(token);
}

function has(token) {
  return blacklist.has(token);
}

module.exports = { add, has };