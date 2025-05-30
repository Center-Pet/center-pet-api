const express = require('express');
const adoptionController = require('../controllers/adoptionController');
const Adoption = require('../models/adoption'); // Adicionando importação

const router = express.Router();

// Listar todas as adoções
router.get('/', adoptionController.getAllAdoptions);

// IMPORTANTE: Rotas específicas primeiro!
// Buscar adoções pelo ID da ONG
router.get('/by-ong/:ongId', adoptionController.getAdoptionsByOngId);

// Criar uma nova adoção
router.post('/create', adoptionController.createAdoption);

// Atualizar uma adoção existente
router.put('/update/:id', adoptionController.updateAdoption);

// Deletar uma adoção
router.delete('/delete/:id', adoptionController.deleteAdoption);

// Obter uma adoção por ID (esta deve ser a ÚLTIMA rota com parâmetro)
router.get('/:id', async function getAdoptionById(req, res) {
    try {
        const adoption = await Adoption.findById(req.params.id)
            .populate('petId')
            .populate('userId')
            .populate('ongId');
            
        if (!adoption) {
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }
        
        res.status(200).json(adoption);
    } catch (err) {
        console.error('Erro ao buscar adoção:', err);
        res.status(500).json({ message: 'Erro ao buscar adoção', error: err.message });
    }
});

module.exports = router;