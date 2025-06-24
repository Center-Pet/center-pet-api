const Adoption = require('../models/adoption');
const Pet = require('../models/pet');
const Ong = require('../models/ong');
const Adopter = require('../models/adopter');
const {
    sendAdoptionRequestEmail,
    sendAdoptionApprovedEmail,
    sendAdoptionRejectedEmail
} = require('../services/emailService');

// Status válidos para adoções
const VALID_ADOPTION_STATUSES = [
    'requestReceived',
    'inProgress', 
    'approved',
    'rejected',
    'canceled',
    'completed'
];

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

        // Validação do status
        if (status && !VALID_ADOPTION_STATUSES.includes(status)) {
            return res.status(400).json({ 
                message: 'Status inválido. Status permitidos: ' + VALID_ADOPTION_STATUSES.join(', '),
                validStatuses: VALID_ADOPTION_STATUSES
            });
        }

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
        console.log('🔄 Iniciando atualização de adoção:', {
            adoptionId: req.params.id,
            newStatus: req.body.status,
            ongId: req.user.id
        });

        // Validação do status
        if (!req.body.status || !VALID_ADOPTION_STATUSES.includes(req.body.status)) {
            return res.status(400).json({ 
                message: 'Status inválido. Status permitidos: ' + VALID_ADOPTION_STATUSES.join(', '),
                validStatuses: VALID_ADOPTION_STATUSES
            });
        }

        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            console.log('❌ Adoção não encontrada:', req.params.id);
            return res.status(404).json({ message: 'Adoção não encontrada.' });
        }

        console.log('📝 Dados da adoção encontrada:', {
            adoptionId: adoption._id,
            petId: adoption.petId,
            userId: adoption.userId,
            status: adoption.status,
            newStatus: req.body.status
        });

        // Verifica se a ONG é a dona do pet
        const pet = await Pet.findById(adoption.petId);
        if (!pet) {
            console.log('❌ Pet não encontrado:', adoption.petId);
            return res.status(404).json({ message: 'Pet não encontrado.' });
        }

        console.log('📝 Dados do pet:', {
            petId: pet._id,
            ongId: pet.ongId,
            requestedOngId: req.user.id
        });

        if (pet.ongId.toString() !== req.user.id) {
            console.log('❌ ONG não autorizada:', {
                petOngId: pet.ongId,
                requestedOngId: req.user.id
            });
            return res.status(403).json({ message: 'Você não tem permissão para atualizar esta adoção.' });
        }

        // Busca os dados do adotante
        const adopter = await Adopter.findById(adoption.userId);
        if (!adopter) {
            console.log('❌ Adotante não encontrado:', adoption.userId);
            return res.status(404).json({ message: 'Adotante não encontrado.' });
        }

        console.log('📝 Dados do adotante:', {
            adopterId: adopter._id,
            email: adopter.email,
            name: adopter.fullName
        });

        // Atualiza o status da adoção
        adoption.status = req.body.status;
        adoption.updatedAt = new Date();
        await adoption.save();

        console.log('✅ Adoção atualizada com sucesso:', {
            adoptionId: adoption._id,
            newStatus: adoption.status
        });

        // Envia e-mail baseado no novo status
        try {
            if (req.body.status === 'approved') {
                console.log('📧 Iniciando envio de e-mail de aprovação...', {
                    destinatario: adopter.email,
                    nomeAdotante: adopter.fullName,
                    nomePet: pet.name,
                    dadosONG: {
                        nome: req.user.name,
                        email: req.user.email,
                        telefone: req.user.phone
                    }
                });

                await sendAdoptionApprovedEmail(
                    adopter.email,
                    adopter.fullName,
                    pet.name,
                    {
                        name: req.user.name,
                        email: req.user.email,
                        phone: req.user.phone
                    }
                );

                console.log('✅ E-mail de aprovação enviado com sucesso para:', adopter.email);
            } else if (req.body.status === 'rejected') {
                console.log('📧 Iniciando envio de e-mail de rejeição...', {
                    destinatario: adopter.email,
                    nomeAdotante: adopter.fullName,
                    nomePet: pet.name
                });

                await sendAdoptionRejectedEmail(adopter.email, adopter.fullName, pet.name);

                console.log('✅ E-mail de rejeição enviado com sucesso para:', adopter.email);
            }
        } catch (emailError) {
            console.error('❌ Erro ao enviar e-mail:', {
                error: emailError.message,
                stack: emailError.stack,
                status: req.body.status,
                destinatario: adopter.email
            });
            // Não retornamos erro aqui para não impedir a atualização da adoção
        }

        res.status(200).json({ message: 'Adoção atualizada com sucesso.' });
    } catch (error) {
        console.error('❌ Erro ao atualizar adoção:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Erro ao atualizar adoção.', error: error.message });
    }
}

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
        console.log('🔄 Iniciando processo de aceitação de adoção:', {
            adoptionId: req.params.id,
            ongId: req.user.id
        });

        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            console.log('❌ Adoção não encontrada:', req.params.id);
            return res.status(404).json({ message: 'Adoção não encontrada.' });
        }

        console.log('📝 Dados da adoção encontrada:', {
            adoptionId: adoption._id,
            petId: adoption.petId,
            userId: adoption.userId,
            status: adoption.status
        });

        // Verifica se a ONG é a dona do pet
        const pet = await Pet.findById(adoption.petId);
        if (!pet) {
            console.log('❌ Pet não encontrado:', adoption.petId);
            return res.status(404).json({ message: 'Pet não encontrado.' });
        }

        console.log('📝 Dados do pet:', {
            petId: pet._id,
            ongId: pet.ongId,
            requestedOngId: req.user.id
        });

        if (pet.ongId.toString() !== req.user.id) {
            console.log('❌ ONG não autorizada:', {
                petOngId: pet.ongId,
                requestedOngId: req.user.id
            });
            return res.status(403).json({ message: 'Você não tem permissão para aceitar esta adoção.' });
        }

        // Busca os dados do adotante
        const adopter = await Adopter.findById(adoption.userId);
        if (!adopter) {
            console.log('❌ Adotante não encontrado:', adoption.userId);
            return res.status(404).json({ message: 'Adotante não encontrado.' });
        }

        console.log('📝 Dados do adotante:', {
            adopterId: adopter._id,
            email: adopter.email,
            name: adopter.fullName
        });

        // Atualiza o status da adoção
        adoption.status = 'approved';
        adoption.updatedAt = new Date();
        await adoption.save();

        console.log('✅ Adoção atualizada com sucesso:', {
            adoptionId: adoption._id,
            newStatus: adoption.status
        });

        // Envia e-mail para o adotante
        try {
            console.log('📧 Iniciando envio de e-mail de aprovação...', {
                destinatario: adopter.email,
                nomeAdotante: adopter.fullName,
                nomePet: pet.name,
                dadosONG: {
                    nome: req.user.name,
                    email: req.user.email,
                    telefone: req.user.phone
                }
            });

            await sendAdoptionApprovedEmail(
                adopter.email,
                adopter.fullName,
                pet.name,
                {
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone
                }
            );

            console.log('✅ E-mail de aprovação enviado com sucesso para:', adopter.email);
        } catch (emailError) {
            console.error('❌ Erro ao enviar e-mail de aprovação:', {
                error: emailError.message,
                stack: emailError.stack,
                destinatario: adopter.email,
                nomeAdotante: adopter.fullName,
                nomePet: pet.name
            });
            // Não retornamos erro aqui para não impedir a aprovação da adoção
        }

        res.status(200).json({ message: 'Adoção aprovada com sucesso.' });
    } catch (error) {
        console.error('❌ Erro ao aprovar adoção:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Erro ao aprovar adoção.', error: error.message });
    }
}

// Rejeitar uma adoção
async function rejectAdoption(req, res) {
    try {
        console.log('🔄 Iniciando processo de rejeição de adoção:', {
            adoptionId: req.params.id,
            ongId: req.user.id
        });

        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            console.log('❌ Adoção não encontrada:', req.params.id);
            return res.status(404).json({ message: 'Adoção não encontrada.' });
        }

        console.log('📝 Dados da adoção encontrada:', {
            adoptionId: adoption._id,
            petId: adoption.petId,
            userId: adoption.userId,
            status: adoption.status
        });

        // Verifica se a ONG é a dona do pet
        const pet = await Pet.findById(adoption.petId);
        if (!pet) {
            console.log('❌ Pet não encontrado:', adoption.petId);
            return res.status(404).json({ message: 'Pet não encontrado.' });
        }

        console.log('📝 Dados do pet:', {
            petId: pet._id,
            ongId: pet.ongId,
            requestedOngId: req.user.id
        });

        if (pet.ongId.toString() !== req.user.id) {
            console.log('❌ ONG não autorizada:', {
                petOngId: pet.ongId,
                requestedOngId: req.user.id
            });
            return res.status(403).json({ message: 'Você não tem permissão para rejeitar esta adoção.' });
        }

        // Busca os dados do adotante
        const adopter = await Adopter.findById(adoption.userId);
        if (!adopter) {
            console.log('❌ Adotante não encontrado:', adoption.userId);
            return res.status(404).json({ message: 'Adotante não encontrado.' });
        }

        console.log('📝 Dados do adotante:', {
            adopterId: adopter._id,
            email: adopter.email,
            name: adopter.fullName
        });

        // Atualiza o status da adoção
        adoption.status = 'rejected';
        adoption.updatedAt = new Date();
        await adoption.save();

        console.log('✅ Adoção atualizada com sucesso:', {
            adoptionId: adoption._id,
            newStatus: adoption.status
        });

        // Envia e-mail para o adotante
        try {
            console.log('📧 Iniciando envio de e-mail de rejeição...', {
                destinatario: adopter.email,
                nomeAdotante: adopter.fullName,
                nomePet: pet.name
            });

            await sendAdoptionRejectedEmail(adopter.email, adopter.fullName, pet.name);

            console.log('✅ E-mail de rejeição enviado com sucesso para:', adopter.email);
        } catch (emailError) {
            console.error('❌ Erro ao enviar e-mail de rejeição:', {
                error: emailError.message,
                stack: emailError.stack,
                destinatario: adopter.email,
                nomeAdotante: adopter.fullName,
                nomePet: pet.name
            });
            // Não retornamos erro aqui para não impedir a rejeição da adoção
        }

        res.status(200).json({ message: 'Adoção rejeitada com sucesso.' });
    } catch (error) {
        console.error('❌ Erro ao rejeitar adoção:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Erro ao rejeitar adoção.', error: error.message });
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

