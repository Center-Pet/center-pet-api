const express = require('express');
const adoptionController = require('../controllers/adoptionController');

const router = express.Router();

// Listar todas as adoções
router.get('/', adoptionController.getAllAdoptions);

// IMPORTANTE: Rotas específicas primeiro!
// Buscar adoções pelo ID da ONG
router.get('/by-ong/:ongId', adoptionController.getAdoptionsByOngId);

// Buscar adoções por múltiplos IDs
router.get('/by-ids', adoptionController.getAdoptionByIds);

// Criar uma nova adoção
router.post('/create', adoptionController.createAdoption);

// Atualizar uma adoção existente
router.put('/update/:id', adoptionController.updateAdoption);

// Deletar uma adoção
router.delete('/delete/:id', adoptionController.deleteAdoption);

// Aceitar uma adoção
router.post('/accept/:id', adoptionController.acceptAdoption);

// Rejeitar uma adoção
router.post('/reject/:id', adoptionController.rejectAdoption);

// Obter uma adoção por ID (esta deve ser a ÚLTIMA rota com parâmetro)
// Mudar para getAllAdoptions porque getAdoptionByOngId não existe
router.get('/:id', function getAdoptionById(req, res) {
    try {
        const adoption = Adoption.findById(req.params.id)
            .then(adoption => {
                if (!adoption) {
                    return res.status(404).json({ message: 'Adoção não encontrada' });
                }
                res.status(200).json(adoption);
            });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar adoção', error: err.message });
    }
});

module.exports = router;