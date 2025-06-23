const express = require('express');
const router = express.Router();
const {
    createPet,
    getPetsByOng,
    getPetById,
    deletePet,
    updatePet,
    listPets
} = require('../controllers/petController');

// Rota para listar todos os pets (deve vir ANTES das rotas com parâmetros)
router.get('/', listPets);

// Rota para listar todos os pets de uma ONG específica (deve vir ANTES das rotas com parâmetros)
router.get('/by-ong/:ongId', getPetsByOng);

// Rota para criar um novo pet
router.post('/register', createPet);

// Rota para deletar um pet pelo ID
router.delete('/delete/:petId', deletePet);

// Rota para editar um pet pelo ID (edição total ou parcial)
router.patch('/update/:petId', updatePet);

// Rota para buscar um pet pelo ID (deve vir DEPOIS das rotas específicas)
router.get('/:petId', getPetById);

module.exports = router;