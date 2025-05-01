const express = require('express');
const cors = require('cors');
const adopterRoutes = require('./src/routes/adopterRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de Adotantes
app.use('/api/adopters', adopterRoutes);

// Rotas de ONGs
app.use('/api/ongs', require('./src/routes/ongRoutes'));

// Rotas de autenticação (login unificado)
app.use('/api/auth', require('./src/routes/authRoutes'));

module.exports = app;