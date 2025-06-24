// Script de teste para validação de status de adoção
const VALID_ADOPTION_STATUSES = [
    'requestReceived',
    'inProgress', 
    'approved',
    'rejected',
    'canceled',
    'completed'
];

// Teste de validação
function testStatusValidation(status) {
    if (!status || !VALID_ADOPTION_STATUSES.includes(status)) {
        return {
            isValid: false,
            message: 'Status inválido. Status permitidos: ' + VALID_ADOPTION_STATUSES.join(', '),
            validStatuses: VALID_ADOPTION_STATUSES
        };
    }
    return { isValid: true };
}

// Testes
console.log('🧪 Testando validação de status de adoção...\n');

const testCases = [
    'requestReceived',
    'inProgress',
    'approved',
    'rejected',
    'canceled',
    'completed',
    'invalid_status',
    'pending',
    '',
    null,
    undefined
];

testCases.forEach(status => {
    const result = testStatusValidation(status);
    console.log(`Status: "${status}" -> ${result.isValid ? '✅ Válido' : '❌ Inválido'}`);
    if (!result.isValid) {
        console.log(`   Mensagem: ${result.message}`);
    }
});

console.log('\n✅ Teste de validação concluído!'); 