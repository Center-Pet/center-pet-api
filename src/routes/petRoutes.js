const express = require('express');
const router = express.Router();
const {
    createPet,
    getPetsByOng,
    getPetById,
    deletePet,
    updatePet // <--- adicione aqui
} = require('../controllers/petController');

// Rota para criar um novo pet
router.post('/register', createPet);

// Rota para listar todos os pets de uma ONG específica
router.get('/by-ong/:ongId', getPetsByOng);

// Rota para buscar um pet pelo ID
router.get('/:petId', getPetById);

// Rota para deletar um pet pelo ID
router.delete('/delete/:petId', deletePet);

// Rota para editar um pet pelo ID (edição total ou parcial)
router.patch('/update/:petId', updatePet);

module.exports = router; // Exporta o roteador