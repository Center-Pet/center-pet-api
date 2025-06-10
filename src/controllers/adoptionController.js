const Adoption = require('../models/adoption');
const Pet = require('../models/pet');
const Ong = require('../models/ong');
const Adopter = require('../models/adopter');
const {
    sendAdoptionRequestEmail,
    sendAdoptionApprovedEmail,
    sendAdoptionRejectedEmail
} = require('../services/emailService');

// Listar todas as adoções
async function getAllAdoptions(req, res) {
    try {
        const adoptions = await Adoption.find();
        res.status(200).json(adoptions);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar adoções', error: err.message });
    }
};

// Buscar adoções por ID da ONG
async function getAdoptionsByOngId(req, res) {
    try {
        const { ongId } = req.params;

        const adoptions = await Adoption.find({ ongId })
            .populate('petId', 'name image')  // Popula dados básicos do pet
            .populate('userId', 'fullName email phone city')
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
async function createAdoption(req, res) {
    try {
        const {
            userId,
            petId,
            ongId,
            status,
            requestDate
        } = req.body;

        // Verifica se já existe uma solicitação recente (últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentAdoption = await Adoption.findOne({
            userId,
            petId,
            requestDate: { $gte: thirtyDaysAgo }
        });

        if (recentAdoption) {
            return res.status(400).json({ 
                message: 'Você já possui uma solicitação de adoção para este pet nos últimos 30 dias.' 
            });
        }

        // Criação de uma nova adoção com base no schema
        const adoption = await Adoption.create({
            userId,
            petId,
            ongId,
            status: status || 'requestReceived',
            requestDate: requestDate || new Date(),
        });

        // Gere o link com o ID da adoção usando a variável de ambiente
        const adoptionLink = `${process.env.FRONTEND_URL}/adoption/${adoption._id}`;

        // Buscar dados para o e-mail
        const [adopter, pet, ong] = await Promise.all([
            Adopter.findById(userId),
            Pet.findById(petId),
            Ong.findById(ongId)
        ]);

        // Enviar e-mail para a ONG
        if (ong && adopter && pet) {
            await sendAdoptionRequestEmail(
                ong.email,
                adopter.fullName || adopter.name,
                pet.name,
                pet._id,
                adopter._id,
                ong._id,
                adoptionLink
            );
        }

        res.status(201).json(adoption);
    } catch (err) {
        res.status(400).json({ message: 'Erro ao criar adoção', error: err.message });
    }
};

// Atualizar uma adoção existente
async function updateAdoption(req, res) {
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
async function deleteAdoption(req, res) {
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

// Aceitar uma adoção
async function acceptAdoption(req, res) {
    try {
        const { id } = req.params;
        console.log("Recebido adoptionId:", id);

        const adoption = await Adoption.findById(id);

        if (!adoption) {
            console.log("Adoção não encontrada!");
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }

        // Não permite alterar se já foi finalizada
        if (adoption.status === 'approved' || adoption.status === 'rejected') {
            return res.status(400).json({ message: 'Adoção já finalizada e não pode ser alterada.' });
        }

        adoption.status = 'approved';
        await adoption.save();

        const [adopter, pet, ong] = await Promise.all([
            Adopter.findById(adoption.userId),
            Pet.findById(adoption.petId),
            Ong.findById(adoption.ongId)
        ]);

        if (!adopter || !pet || !ong) {
            console.log("Adotante, pet ou ONG não encontrados!");
            return res.status(404).json({ message: 'Adotante, pet ou ONG não encontrados' });
        }

        // Preparar dados de contato da ONG
        const ongContact = {
            whatsapp: ong.phone,
            email: ong.email,
            instagram: ong.socialMidia?.instagram,
            facebook: ong.socialMidia?.facebook
        };

        await sendAdoptionApprovedEmail(adopter.email, adopter.fullName || adopter.name, pet.name, ongContact);

        res.status(200).json({ message: 'Adoção aprovada e email enviado', adoption });
    } catch (err) {
        console.error("Erro ao aceitar adoção:", err);
        res.status(500).json({ message: 'Erro ao aprovar adoção', error: err.message });
    }
}

// Rejeitar uma adoção
async function rejectAdoption(req, res) {
    try {
        const { id } = req.params;
        console.log("Recebido adoptionId:", id);

        const adoption = await Adoption.findById(id);

        if (!adoption) {
            console.log("Adoção não encontrada!");
            return res.status(404).json({ message: 'Adoção não encontrada' });
        }

        // Não permite alterar se já foi finalizada
        if (adoption.status === 'approved' || adoption.status === 'rejected') {
            return res.status(400).json({ message: 'Adoção já finalizada e não pode ser alterada.' });
        }

        adoption.status = 'rejected';
        await adoption.save();

        const adopter = await Adopter.findById(adoption.userId);
        const pet = await Pet.findById(adoption.petId);

        if (!adopter || !pet) {
            console.log("Adotante ou pet não encontrados!");
            return res.status(404).json({ message: 'Adotante ou pet não encontrados' });
        }

        await sendAdoptionRejectedEmail(adopter.email, adopter.fullName || adopter.name, pet.name);

        res.status(200).json({ message: 'Adoção rejeitada e email enviado', adoption });
    } catch (err) {
        console.error("Erro ao rejeitar adoção:", err);
        res.status(500).json({ message: 'Erro ao rejeitar adoção', error: err.message });
    }
}

// Buscar adoção por petId, userId e ongId
async function getAdoptionByIds(req, res) {
    try {
        const { petId, userId, ongId } = req.query;
        if (!petId || !userId || !ongId) {
            return res.status(400).json({ message: 'Parâmetros obrigatórios não informados.' });
        }
        const adoption = await Adoption.findOne({ petId, userId, ongId });
        if (!adoption) {
            return res.status(404).json({ message: 'Adoção não encontrada.' });
        }
        res.status(200).json(adoption);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar adoção', error: err.message });
    }
}

module.exports = {
    getAllAdoptions,
    getAdoptionsByOngId,
    createAdoption,
    updateAdoption,
    deleteAdoption,
    getAdoptionByIds,
    rejectAdoption,
    acceptAdoption
};