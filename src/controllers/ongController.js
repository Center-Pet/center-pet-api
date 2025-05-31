const Ong = require('../models/ong');
const Pet = require('../models/pet');
const Adopter = require('../models/adopter'); // Adicionar esta linha
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Adicionar esta importação
const { sendWelcomeEmail, sendDeleteEmail } = require('../services/emailService');

// Função para criar uma nova ONG
async function createOng(req, res) {
  try {
    // Extraindo os dados do corpo da requisição
    const {
      name,
      description,
      email,
      password,
      phone,
      address,
      socialMedia,
      pixKey,
      profileImage,
      role,
      document,
      collaborators
    } = req.body;

    // Preparar os dados conforme o modelo Ong
    let ongData = {
      name,
      description,
      email,
      password,
      phone,
      pixKey: pixKey || "",
      profileImg: profileImage,
      collaborators: Number(collaborators) || 0,
      role: role
    };

    // Chave secreta para o hash determinístico
    const APP_SECRET = process.env.APP_SECRET || 'suaChaveSecretaAqui';

    // Defina os campos com base no tipo de organização
    if (document) {
      if (document.type === "CNPJ") {
        // Hash determinístico para CNPJ
        const cnpjHash = crypto
          .createHmac('sha256', APP_SECRET)
          .update(document.number)
          .digest('hex');

        // Hash bcrypt para CNPJ (segurança)
        const salt = await bcrypt.genSalt(10);
        const hashedCnpj = await bcrypt.hash(document.number, salt);

        ongData.cnpj = hashedCnpj;
        ongData.cnpjHash = cnpjHash;
      } else if (document.type === "CPF") {
        // Hash determinístico para CPF
        const cpfHash = crypto
          .createHmac('sha256', APP_SECRET)
          .update(document.number)
          .digest('hex');

        // Hash bcrypt para CPF (segurança)
        const salt = await bcrypt.genSalt(10);
        const hashedCpf = await bcrypt.hash(document.number, salt);

        ongData.cpf = hashedCpf;
        ongData.cpfHash = cpfHash;
      }
    }

    // Configurar o endereço
    if (address) {
      ongData.address = {
        uf: address.uf || "", // Adicione o campo UF
        city: address.city || "",
        street: address.street || "",
        number: address.number || "",
        neighborhood: address.neighborhood || "",
        cep: address.zipCode || "",
        complement: address.complement || ""
      };
    }

    // Configurar redes sociais
    if (socialMedia) {
      ongData.socialMidia = {
        instagram: socialMedia.instagram || "",
        facebook: socialMedia.facebook || "",
        site: socialMedia.website || ""
      };
    }

    // Verificar campos obrigatórios pelo role
    const camposFaltantes = [];

    // Validações específicas por tipo
    if (role === "ONG" && !ongData.cnpj) {
      camposFaltantes.push('CNPJ');
    }
    if (role === "Projeto") {
      if (!ongData.cpf) camposFaltantes.push('CPF');
      if (!ongData.collaborators) camposFaltantes.push('Número de colaboradores');
    }
    if (role === "Protetor" && !ongData.cpf) {
      camposFaltantes.push('CPF');
    }
    if (!ongData.name) camposFaltantes.push('Nome');
    if (!ongData.email) camposFaltantes.push('Email');
    if (!ongData.password) camposFaltantes.push('Senha');
    if (!ongData.phone) camposFaltantes.push('Telefone');
    if (!ongData.profileImg) camposFaltantes.push('Imagem de perfil');
    if (!ongData.address?.city) camposFaltantes.push('Cidade');

    if (camposFaltantes.length > 0) {
      console.log("Campos obrigatórios faltando:", camposFaltantes);
      return res.status(400).json({
        success: false,
        message: `Por favor, preencha todos os campos obrigatórios: ${camposFaltantes.join(', ')}`
      });
    }

    // Verificar se já existe ONG ou ADOTANTE com mesmo email, cnpj ou cpf
    console.log("Verificando se email já existe...");
    
    // Verificar email em AMBAS as coleções
    const existingOng = await Ong.findOne({ email: ongData.email });
    const existingAdopter = await Adopter.findOne({ email: ongData.email });
    
    if (existingOng || existingAdopter) {
      console.log("Email já existe no sistema");
      return res.status(400).json({
        success: false,
        message: 'Este e-mail já está cadastrado no sistema'
      });
    }
    
    // Verificar apenas CPF/CNPJ hash em ONGs
    const filtroDocumento = { $or: [] };
    
    // Apenas verifica CNPJ Hash se for um valor válido
    if (ongData.cnpjHash) {
      filtroDocumento.$or.push({ cnpjHash: ongData.cnpjHash });
    }

    // Apenas verifica CPF Hash se for um valor válido
    if (ongData.cpfHash) {
      filtroDocumento.$or.push({ cpfHash: ongData.cpfHash });
    }
    
    if (filtroDocumento.$or.length > 0) {
      const existingDoc = await Ong.findOne(filtroDocumento);
      if (existingDoc) {
        let errorMessage = '';
        if (ongData.cnpjHash && existingDoc.cnpjHash === ongData.cnpjHash) {
          errorMessage = 'CNPJ já cadastrado';
        } else if (ongData.cpfHash && existingDoc.cpfHash === ongData.cpfHash) {
          errorMessage = 'CPF já cadastrado';
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage
        });
      }
    }

    // Criptografar a senha
    console.log("Criptografando senha...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    ongData.password = hashedPassword;

    // Criar a nova ONG
    console.log("Criando nova ONG...");
    const newOng = new Ong(ongData);

    // Salvar a ONG no banco de dados
    console.log("Salvando ONG no banco de dados...");
    const savedOng = await newOng.save();
    await sendWelcomeEmail(ongData.email, ongData.name, true);

    // Remover campos sensíveis do objeto de resposta
    const ongResponse = savedOng.toObject();
    delete ongResponse.password;
    delete ongResponse.cpf;
    delete ongResponse.cnpj;
    delete ongResponse.cpfHash;
    delete ongResponse.cnpjHash;

    res.status(201).json({
      success: true,
      message: 'ONG criada com sucesso',
      data: ongResponse
    });

  } catch (error) {
    console.error("ERRO AO CRIAR ONG:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: 'Erro ao criar ONG',
      error: error.message
    });
  }
};

// Função para deletar uma ONG
async function deleteOng(req, res) {
  try {
    const { id } = req.params;

    console.log(`Tentando deletar ONG com ID: ${id}`);

    // Verificar se a ONG existe
    const ong = await Ong.findById(id);

    if (!ong) {
      console.log(`ONG com ID ${id} não encontrada`);
      return res.status(404).json({
        success: false,
        message: 'ONG não encontrada'
      });
    }

    // Capturar email e nome antes de deletar
    const { email, name } = ong;

    // Primeiro, deletar todos os pets associados a esta ONG
    console.log(`Deletando todos os pets da ONG com ID: ${id}`);
    const petsDeleteResult = await Pet.deleteMany({ ongId: id });
    console.log(`${petsDeleteResult.deletedCount} pets deletados com sucesso`);

    // Depois, deletar a ONG
    await Ong.findByIdAndDelete(id);

    console.log(`ONG com ID ${id} e todos seus pets deletados com sucesso`);

    // Enviar email de confirmação de exclusão
    try {
      await sendDeleteEmail(email, name, true); // true indica que é uma ONG
      console.log(`Email de confirmação de exclusão enviado para: ${email}`);
    } catch (emailError) {
      console.error(`Erro ao enviar email de confirmação: ${emailError.message}`);
      // Continue o processo mesmo se o envio de email falhar
    }

    res.status(200).json({
      success: true,
      message: `ONG deletada com sucesso. ${petsDeleteResult.deletedCount} pets associados também foram removidos.`
    });

  } catch (error) {
    console.error("ERRO AO DELETAR ONG:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: 'Erro ao deletar ONG',
      error: error.message
    });
  }
};


// Função para listar ONGs
async function listOngs(req, res) {
  try {
    console.log("Buscando lista de ONGs...");

    // Parâmetros de consulta opcionais
    const { role, city, verified } = req.query;

    // Construindo o filtro com base nos parâmetros
    const filter = {};

    // Filtro por tipo de organização (ONG, Projeto ou Protetor)
    if (role) {
      filter.role = role;
    }

    // Filtro por cidade
    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' }; // Case-insensitive
    }

    // Filtro por status de verificação
    if (verified !== undefined) {
      filter.verified = verified === 'true';
    }

    // Buscar ONGs com os filtros aplicados
    const ongs = await Ong.find(filter)
      .select('-password') // Exclui o campo senha
      .sort({ registerDate: -1 }); // Ordena do mais recente para o mais antigo

    console.log(`${ongs.length} ONGs encontradas`);

    res.status(200).json({
      success: true,
      count: ongs.length,
      data: ongs
    });

  } catch (error) {
    console.error("ERRO AO LISTAR ONGS:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: 'Erro ao listar ONGs',
      error: error.message
    });
  }
}

// Adicione após a função listOngs

// Função para editar uma ONG
async function updateOng(req, res) {
  try {
    const { id } = req.params;
    console.log(`Tentando atualizar ONG com ID: ${id}`);

    // Verificar se a ONG existe
    const ong = await Ong.findById(id);
    if (!ong) {
      console.log(`ONG com ID ${id} não encontrada`);
      return res.status(404).json({
        success: false,
        message: 'ONG não encontrada'
      });
    }

    // Extrair dados da requisição
    const {
      name,
      description,
      email,
      password,
      phone,
      address,
      socialMedia,
      pixKey,
      profileImage,
      collaborators,
      // role e cpf/cnpj não podem ser alterados
    } = req.body;

    // Preparar os dados para atualização
    const updateData = {};

    // Atualizar apenas campos enviados na requisição
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (pixKey !== undefined) updateData.pixKey = pixKey;
    if (profileImage !== undefined) updateData.profileImg = profileImage;

    // Atualizar senha - apenas se for enviada
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
      console.log("Senha atualizada e criptografada");
    }

    // Atualizar collaborators apenas se for um Projeto
    if (ong.role === 'Projeto' && collaborators !== undefined) {
      updateData.collaborators = Number(collaborators);
    }

    // Atualizar endereço
    if (address) {
      updateData.address = {};
      if (address.uf !== undefined) updateData.address.uf = address.uf;
      if (address.city !== undefined) updateData.address.city = address.city;
      if (address.street !== undefined) updateData.address.street = address.street;
      if (address.number !== undefined) updateData.address.number = address.number;
      if (address.neighborhood !== undefined) updateData.address.neighborhood = address.neighborhood; // Adicione esta linha
      if (address.cep !== undefined) updateData.address.cep = address.cep; // Adicione esta linha
      if (address.complement !== undefined) updateData.address.complement = address.complement;
    }

    // Atualizar redes sociais
    if (socialMedia) {
      updateData.socialMidia = {};
      if (socialMedia.instagram !== undefined) updateData.socialMidia.instagram = socialMedia.instagram;
      if (socialMedia.facebook !== undefined) updateData.socialMidia.facebook = socialMedia.facebook;
      if (socialMedia.website !== undefined) updateData.socialMidia.site = socialMedia.website;
    }

    console.log("Dados a serem atualizados:", updateData);

    // Atualizar ONG
    const updatedOng = await Ong.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    console.log(`ONG com ID ${id} atualizada com sucesso`);

    res.status(200).json({
      success: true,
      message: 'ONG atualizada com sucesso',
      data: updatedOng
    });

  } catch (error) {
    console.error("ERRO AO ATUALIZAR ONG:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar ONG',
      error: error.message
    });
  }
}


// Função para buscar ONG por ID
async function getOngById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Buscando ONG com ID: ${id}`);

    // Buscar a ONG pelo ID
    const ong = await Ong.findById(id).select('-password');

    // Verificar se a ONG existe
    if (!ong) {
      console.log(`ONG com ID ${id} não encontrada`);
      return res.status(404).json({
        success: false,
        message: 'ONG não encontrada'
      });
    }

    console.log(`ONG com ID ${id} encontrada`);

    res.status(200).json({
      success: true,
      data: ong
    });

  } catch (error) {
    console.error("ERRO AO BUSCAR ONG:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);

    // Verifica se o erro é de ID inválido (formato incorreto)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de ONG inválido',
        error: 'Formato de ID incorreto'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ONG',
      error: error.message
    });
  }
}

module.exports = {
  createOng,
  deleteOng,
  listOngs,
  updateOng,
  getOngById
};