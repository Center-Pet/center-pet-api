const bcrypt = require('bcrypt');
const Adopter = require('../models/adopter');
const mongoose = require('mongoose');
const { sendWelcomeEmail } = require('../services/emailService');

// Função para converter "true"/"false" (strings) em booleanos
const parseBooleanFields = (data) => {
  const booleanFields = [
    "petsAllowed", "homeSafety", "allergy", "familyAgreement",
    "willingToTrain", "keepVaccinesUpToDate", "regularVetVisits",
    "financialConditions", "awareOfLaw", "commitToNeverAbandon",
    "returnToOng", "awareOfResponsibilities", "finalDeclarationAgreement"
  ];

  for (let field of booleanFields) {
    if (field in data) {
      data[field] = data[field] === 'true' || data[field] === true;
    }
  }

  return data;
};

// Controller de cadastro inicial
async function createAdopter(req, res) {
  try {
    const { fullName, cpf, email, password } = req.body;
    if (!fullName || !cpf || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verifica duplicidade
    const conflict = await Adopter.findOne({ $or: [{ cpf }, { email }] });
    if (conflict) {
      return res
        .status(409)
        .json({ message: "Já existe um adotante com esse CPF ou e-mail." });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria e salva
    const newAdopter = new Adopter({
      fullName, cpf, email, password: hashedPassword,
      safeAdopter: false, // default
    });
    await newAdopter.save();
    await sendWelcomeEmail(email, fullName, false); // Envia e-mail de boas-vindas para adotante

    const { password: _, ...adopterData } = newAdopter.toObject();
    res.status(201).json({ message: "Adotante criado com sucesso!", adopter: adopterData });
  } catch (error) {
    console.error("Erro ao criar adotante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

// Controller de formulário completo
async function updateSafeAdopter(req, res) {
  try {
    const formData = parseBooleanFields(req.body);
    // Usar o ID do usuário em vez do email
    const updated = await Adopter.findByIdAndUpdate(
      formData._id, // Usando o ID enviado do frontend
      { $set: formData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Adotante não encontrado." });

    res.status(200).json({ message: "Formulário atualizado com sucesso.", adopter: updated });
  } catch (error) {
    console.error("Erro ao atualizar adotante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

async function listAdopters(req, res) {
  try {
    const adopters = await Adopter.find({});
    return res.status(200).json(adopters);
  } catch (err) {
    console.error('Erro ao buscar adotantes:', err);
    return res.status(500).json({ message: 'Erro interno ao buscar adotantes.' });
  }
}

// Atualização de perfil (dados básicos do adotante)
async function updateAdopterProfile(req, res) {
  try {
    const { id } = req.params; // Pegue o ID dos parâmetros da URL
    const {
      fullName,
      password,
      age,
      phone,
      cep,
      city,
      state,
      street,
      number,
      neighborhood,
      complement,
      profession,
      profileImg,
      description
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID do adotante inválido." });
    }

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (age) updateData.age = age;
    if (phone) updateData.phone = phone;
    if (cep) updateData.cep = cep;
    if (state) updateData.state = state; // Adicionando o estado
    if (city) updateData.city = city;
    if (street) updateData.street = street;
    if (number) updateData.number = number;
    if (neighborhood) updateData.neighborhood = neighborhood;
    if (complement) updateData.complement = complement;
    if (profession) updateData.profession = profession;
    if (profileImg) updateData.profileImg = profileImg;
    if (description) updateData.description = description;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await Adopter.findByIdAndUpdate(
      id, // Busca pelo ID
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Adotante não encontrado." });
    }

    const { password: _, ...adopterData } = updated.toObject();
    res.status(200).json({ message: "Perfil atualizado com sucesso.", adopter: adopterData });

  } catch (error) {
    console.error("Erro ao atualizar perfil do adotante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

// Função para excluir um adotante
async function deleteAdopter(req, res) {
  try {
    const { adopterId } = req.params; // Pegando o ID do adotante da URL

    // Converte o ID para ObjectId caso necessário
    if (!mongoose.Types.ObjectId.isValid(adopterId)) {
      return res.status(400).json({ message: "ID do adotante inválido." });
    }

    // Verifica se o adotante existe
    const adopter = await Adopter.findById(adopterId);
    if (!adopter) {
      return res.status(404).json({ message: "Adotante não encontrado." });
    }

    // Exclui o adotante do banco de dados
    await Adopter.findByIdAndDelete(adopterId);

    res.status(200).json({ message: "Adotante excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir adotante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

// Buscar adotante por ID
async function getAdopterById(req, res) {
  try {
    const { adopterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adopterId)) {
      return res.status(400).json({ message: "ID do adotante inválido." });
    }

    const adopter = await Adopter.findById(adopterId).select("-password"); // ocultar senha

    if (!adopter) {
      return res.status(404).json({ message: "Adotante não encontrado." });
    }

    res.status(200).json(adopter);
  } catch (error) {
    console.error("Erro ao buscar adotante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}


module.exports = {
  createAdopter,
  updateSafeAdopter,
  listAdopters,
  updateAdopterProfile,
  deleteAdopter,
  getAdopterById,
};

