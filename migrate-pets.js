const mongoose = require('mongoose');

// Carregar variáveis de ambiente baseado no NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', NODE_ENV);

// Carregar o arquivo .env apropriado
if (NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.development' });
} else if (NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config();
}

console.log("MONGO_URI:", process.env.MONGO_URI);

// Conectar ao banco de dados
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Pet = require('./src/models/pet');

async function migratePets() {
  try {
    console.log('🔄 Iniciando migração dos pets...');
    
    // Buscar todos os pets
    const pets = await Pet.find({});
    console.log(`📊 Encontrados ${pets.length} pets para migrar`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const pet of pets) {
      try {
        // Verificar se o pet já tem o formato correto
        if (pet.health && pet.health.specialCondition) {
          // Se specialCondition já é um array, pular
          if (Array.isArray(pet.health.specialCondition)) {
            console.log(`✅ Pet ${pet.name} já está no formato correto`);
            continue;
          }
          
          // Se é uma string, converter para array
          let specialConditions = [];
          if (typeof pet.health.specialCondition === 'string') {
            specialConditions = pet.health.specialCondition
              .split(',')
              .map(condition => condition.trim())
              .filter(condition => condition !== '');
          }
          
          // Garantir que sempre tenha pelo menos uma condição
          if (specialConditions.length === 0) {
            specialConditions = ['Nenhuma'];
          }
          
          // Atualizar o pet
          await Pet.findByIdAndUpdate(pet._id, {
            'health.specialCondition': specialConditions
          });
          
          console.log(`✅ Pet ${pet.name} migrado: ${specialConditions.join(', ')}`);
          migratedCount++;
        } else {
          // Se não tem specialCondition, adicionar 'Nenhuma'
          await Pet.findByIdAndUpdate(pet._id, {
            'health.specialCondition': ['Nenhuma']
          });
          
          console.log(`✅ Pet ${pet.name} recebeu condição padrão: Nenhuma`);
          migratedCount++;
        }
      } catch (error) {
        console.error(`❌ Erro ao migrar pet ${pet.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Migração concluída!`);
    console.log(`✅ Pets migrados com sucesso: ${migratedCount}`);
    console.log(`❌ Erros: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    // Fechar conexão com o banco
    await mongoose.connection.close();
    console.log('🔌 Conexão com o banco fechada');
  }
}

// Executar migração
migratePets(); 