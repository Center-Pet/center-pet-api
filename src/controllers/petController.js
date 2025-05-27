const Pet = require('../models/pet');

// Rota para criar um novo pet
async function createPet(req, res) {
  try {
    const {
      name,
      type,
      coat,
      state,
      city,
      bio,
      gender,
      age,
      breed,
      size,
      vaccinated,
      castrated,
      dewormed,
      specialCondition,
      waitingTime,
      ongId,
      imagens, // Array de URLs de imagens
    } = req.body;

    // Criação do pet
    const newPet = new Pet({
      name,
      type,
      coat,
      state,
      city,
      description: bio,
      gender,
      age,
      breed,
      size,
      health: {
        vaccinated: vaccinated === 'Sim',
        castrated: castrated === 'Sim',
        dewormed: dewormed === 'Sim',
        specialCondition,
      },
      waitingTime,
      ongId,
      image: imagens, // Array de URLs de imagens
    });

    const savedPet = await newPet.save();
    res.status(201).json({ message: 'Pet registrado com sucesso!', pet: savedPet });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar o pet.', error: error.message });
  }
}

// Rota para listar todos os pets de uma ONG específica
async function getPetsByOng(req, res) {
  try {
    const { ongId } = req.params;
    const pets = await Pet.find({ ongId });
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets da ONG.', error: error.message });
  }
}

// Rota para buscar um pet pelo ID
async function getPetById(req, res) {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pet.', error: error.message });
  }
}

// Rota para deletar um pet pelo ID
async function deletePet(req, res) {
  try {
    const { petId } = req.params;
    const deletedPet = await Pet.findByIdAndDelete(petId);
    if (!deletedPet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    res.status(200).json({ message: 'Pet deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar pet.', error: error.message });
  }
}

// Rota para editar um pet pelo ID
async function updatePet(req, res) {
  try {
    const { petId } = req.params;
    const updateData = req.body;

    // Se estiver atualizando campos booleanos de health, converte 'Sim'/'Não' para boolean
    if (updateData.health) {
      if (typeof updateData.health.vaccinated === 'string')
        updateData.health.vaccinated = updateData.health.vaccinated === 'Sim';
      if (typeof updateData.health.castrated === 'string')
        updateData.health.castrated = updateData.health.castrated === 'Sim';
      if (typeof updateData.health.dewormed === 'string')
        updateData.health.dewormed = updateData.health.dewormed === 'Sim';
    }

    // Atualiza o pet
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }
    res.status(200).json({ message: 'Pet atualizado com sucesso.', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pet.', error: error.message });
  }
}

module.exports = {
  createPet,
  getPetsByOng,
  getPetById,
  deletePet,
  updatePet, // <--- adicione aqui
};