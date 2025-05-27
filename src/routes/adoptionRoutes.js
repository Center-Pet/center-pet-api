const express = require('express');
const adoptionController = require('../controllers/adoptionController');

const router = express.Router();

// Listar todas as adoções
router.get('/', adoptionController.getAllAdoptions);

// Obter uma adoção por ID
router.get('/:id', adoptionController.getAdoptionById);

// Criar uma nova adoção
router.post('/create', adoptionController.createAdoption);

// Atualizar uma adoção existente
router.put('/update/:id', adoptionController.updateAdoption);

// Deletar uma adoção
router.delete('/delete/:id', adoptionController.deleteAdoption);

module.exports = router;