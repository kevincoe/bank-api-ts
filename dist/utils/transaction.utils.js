"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUtils = void 0;
const error_utils_1 = require("./error.utils");
/**
 * Classe utilitária para transações
 */
class TransactionUtils {
    /**
     * Verifica se o usuário tem permissão para acessar a conta
     */
    static async checkAccountAccess(userId, accountId, accountRepository) {
        const account = await accountRepository.findById(accountId);
        if (!account) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        // Administradores têm acesso a todas as contas
        if (userId && account.user.toString() !== userId) {
            throw new error_utils_1.AppError('Você não tem permissão para acessar esta conta', 403);
        }
        return true;
    }
    /**
     * Formata o valor monetário para exibição
     */
    static formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }
    /**
     * Gera um número de referência para a transação
     */
    static generateReferenceNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `REF-${timestamp}-${random}`;
    }
}
exports.TransactionUtils = TransactionUtils;
//# sourceMappingURL=transaction.utils.js.map