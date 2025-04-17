/**
 * Classe utilitária para transações
 */
export declare class TransactionUtils {
    /**
     * Verifica se o usuário tem permissão para acessar a conta
     */
    static checkAccountAccess(userId: string, accountId: string, accountRepository: any): Promise<boolean>;
    /**
     * Formata o valor monetário para exibição
     */
    static formatCurrency(amount: number): string;
    /**
     * Gera um número de referência para a transação
     */
    static generateReferenceNumber(): string;
}
