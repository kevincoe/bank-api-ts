// Diagrama de Entidades e Relacionamentos para Solução Bancária

/**
 * Entidades Principais:
 * 
 * 1. Usuário (User)
 *    - Representa os clientes e administradores do sistema bancário
 *    - Armazena informações pessoais e credenciais de autenticação
 * 
 * 2. Conta (Account)
 *    - Representa as contas bancárias dos usuários
 *    - Cada usuário pode ter múltiplas contas
 *    - Armazena informações como saldo, tipo de conta, etc.
 * 
 * 3. Transação (Transaction)
 *    - Representa movimentações financeiras
 *    - Pode ser depósito, saque ou transferência
 *    - Registra origem, destino, valor e data da operação
 * 
 * Relacionamentos:
 * 
 * - Um Usuário pode ter várias Contas (1:N)
 * - Uma Conta pode ter várias Transações (1:N)
 * - Uma Transação pode envolver uma ou duas Contas (dependendo do tipo)
 */

// Diagrama simplificado:
//
// +-------------+       +-------------+       +----------------+
// |   Usuário   |       |    Conta    |       |   Transação    |
// +-------------+       +-------------+       +----------------+
// | id          |       | id          |       | id             |
// | nome        |       | número      |       | tipo           |
// | email       |------>| tipo        |------>| valor          |
// | senha       |       | saldo       |       | data           |
// | cpf         |       | usuarioId   |       | contaOrigemId  |
// | telefone    |       | ativa       |       | contaDestinoId |
// | endereço    |       | dataCriacao |       | descrição      |
// | perfil      |       |             |       | status         |
// +-------------+       +-------------+       +----------------+
