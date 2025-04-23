const express = require('express');
const cors = require('cors');
const adopterRoutes = require('./src/routes/adopterRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de Adotantes
app.use('/api/adopters', adopterRoutes);

module.exports = app;