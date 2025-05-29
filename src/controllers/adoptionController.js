const Adoption = require('../models/adoption');

// Listar todas as adoções
async function getAllAdoptions(req, res){
    try {
        const adoptions = await Adoption.find();
        res.status(200).json(adoptions);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar adoções', error: err.message });
    }
};

// Buscar adoções por ID da ONG
async function getAdoptionsByOngId(req, res){
    try {
        const { ongId } = req.params;
        
        const adoptions = await Adoption.find({ ongId })
            .populate('petId', 'name image')  // Popula dados básicos do pet
            .populate('userId', 'name email'); // Popula dados básicos do usuário
        
        if (adoptions.length === 0) {
            return res.status(200).json({ 
                message: 'Nenhuma adoção encontrada para esta ONG',
                adoptions: []
            });
        }
        
        res.status(200).json({
            count: adoptions.length,
            adoptions
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar adoções da ONG', error: err.message });
    }
}

// Criar uma nova adoção
async function createAdoption(req, res){
    try {
        const {
            userId,
            petId,
            ongId,
            status,
            requestDate
            //transportationDate,
            //startDateAdjustment,
            //endDateAdjustment
        } = req.body;

        // Criação de uma nova adoção com base no schema
        const adoption = new Adoption({
            userId,
            petId,
            ongId,
            status: status || 'requestReceived', // Define o status padrão como 'requestReceived' se não for fornecido
            requestDate: requestDate || new Date(), // Define a data de solicitação como a data atual se não for fornecida
            //transportationDate,
            //startDateAdjustment,
            //endDateAdjustment
        });

        // Salvando no banco de dados
        await adoption.save();
        res.status(201).json(adoption);
    } catch (err) {
        res.status(400).json({ message: 'Erro ao criar adoção', error: err.message });
    }
};

// Atualizar uma adoção existente
async function updateAdoption(req, res){
    try {
        // Filtra apenas os campos permitidos pelo schema
        const allowedFields = [
            'userId',
            'petId',
            'ongId',
            'status',
            'requestDate'
            //'transportationDate',
            //'startDateAdjustment',
            //'endDateAdjustment'
        ];
        const updateData = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }

        // Atualiza com validação do schema
        const adoption = await Adoption.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!adoption) {
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }
        res.status(200).json(adoption);
    } catch (err) {
        res.status(400).json({ message: 'Erro ao atualizar adoção', error: err.message });
    }
};

// Deletar uma adoção
async function deleteAdoption(req, res){
    try {
        // Busca a adoção antes de deletar para garantir que existe e para possíveis hooks do schema
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }
        await adoption.deleteOne();
        res.status(200).json({ message: 'Adoção removida com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar adoção', error: err.message });
    }
};

module.exports = {
    getAllAdoptions,
    getAdoptionsByOngId,
    createAdoption,
    updateAdoption,
    deleteAdoption
};