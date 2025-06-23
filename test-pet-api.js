const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Função para testar a criação de um pet com múltiplas condições especiais
async function testCreatePet() {
  try {
    console.log('🧪 Testando criação de pet com múltiplas condições especiais...');
    
    const petData = {
      name: "Teste Pet",
      type: "Cachorro",
      coat: "Curta",
      state: "SP",
      city: "São Paulo",
      bio: "Pet de teste para verificar múltiplas condições especiais",
      gender: "Macho",
      age: "Adulto",
      breed: "Labrador Retriever",
      size: "Grande",
      vaccinated: "Sim",
      castrated: "Sim",
      dewormed: "Sim",
      specialCondition: ["Cego", "Deficiência Motora"], // Array de condições
      waitingTime: "3",
      status: "Disponível",
      ongId: "507f1f77bcf86cd799439011", // ID fictício para teste
      imagens: ["https://example.com/image1.jpg"]
    };

    const response = await axios.post(`${API_URL}/pets/register`, petData);
    console.log('✅ Pet criado com sucesso!');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    
    return response.data.pet._id;
  } catch (error) {
    console.error('❌ Erro ao criar pet:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar a atualização de um pet
async function testUpdatePet(petId) {
  if (!petId) {
    console.log('⚠️ Pulando teste de atualização - pet não foi criado');
    return;
  }

  try {
    console.log('🧪 Testando atualização de pet...');
    
    const updateData = {
      name: "Teste Pet Atualizado",
      health: {
        vaccinated: true,
        castrated: true,
        dewormed: true,
        specialCondition: ["Surdo", "Diabetes", "Idoso"] // Novas condições
      },
      status: "Indisponível"
    };

    const response = await axios.patch(`${API_URL}/pets/update/${petId}`, updateData);
    console.log('✅ Pet atualizado com sucesso!');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Erro ao atualizar pet:', error.response?.data || error.message);
  }
}

// Função para testar a busca de um pet
async function testGetPet(petId) {
  if (!petId) {
    console.log('⚠️ Pulando teste de busca - pet não foi criado');
    return;
  }

  try {
    console.log('🧪 Testando busca de pet...');
    
    const response = await axios.get(`${API_URL}/pets/${petId}`);
    console.log('✅ Pet encontrado com sucesso!');
    console.log('📋 Dados do pet:', JSON.stringify(response.data, null, 2));
    
    // Verificar se as condições especiais estão no formato correto
    if (response.data.health && response.data.health.specialCondition) {
      console.log('🔍 Condições especiais:', response.data.health.specialCondition);
      if (Array.isArray(response.data.health.specialCondition)) {
        console.log('✅ Condições especiais estão no formato de array correto!');
      } else {
        console.log('⚠️ Condições especiais não estão no formato de array');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao buscar pet:', error.response?.data || error.message);
  }
}

// Função para testar a listagem de pets
async function testListPets() {
  try {
    console.log('🧪 Testando listagem de pets...');
    
    const response = await axios.get(`${API_URL}/pets`);
    console.log('✅ Pets listados com sucesso!');
    console.log(`📊 Total de pets: ${response.data.length}`);
    
    // Verificar o primeiro pet para ver o formato das condições especiais
    if (response.data.length > 0) {
      const firstPet = response.data[0];
      console.log('🔍 Primeiro pet:', firstPet.name);
      if (firstPet.health && firstPet.health.specialCondition) {
        console.log('🔍 Condições especiais do primeiro pet:', firstPet.health.specialCondition);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao listar pets:', error.response?.data || error.message);
  }
}

// Função principal para executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes da API de Pets...\n');
  
  // Teste 1: Listar pets existentes
  await testListPets();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 2: Criar novo pet
  const petId = await testCreatePet();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 3: Buscar pet criado
  await testGetPet(petId);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 4: Atualizar pet
  await testUpdatePet(petId);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Teste 5: Buscar pet atualizado
  await testGetPet(petId);
  
  console.log('\n🎉 Testes concluídos!');
}

// Executar testes
runTests().catch(console.error); 