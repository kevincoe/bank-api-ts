import { ITransaction } from '../models/transaction.model';
/**
 * Interface para o serviço de relatórios de transações
 */
export interface ITransactionReportService {
    generateTransactionReceipt(transaction: ITransaction): string;
    calculateAccountBalance(accountId: string, startDate?: Date, endDate?: Date): Promise<number>;
    getTransactionSummary(accountId: string, startDate?: Date, endDate?: Date): Promise<any>;
}
/**
 * Implementação do serviço de relatórios de transações
 */
export declare class TransactionReportService implements ITransactionReportService {
    private transactionRepository;
    private accountRepository;
    constructor(transactionRepository: any, accountRepository: any);
    /**
     * Gera um recibo para uma transação
     */
    generateTransactionReceipt(transaction: ITransaction): string;
    /**
     * Calcula o saldo de uma conta em um período
     */
    calculateAccountBalance(accountId: string, startDate?: Date, endDate?: Date): Promise<number>;
    /**
     * Obtém um resumo das transações de uma conta
     */
    getTransactionSummary(accountId: string, startDate?: Date, endDate?: Date): Promise<any>;
    /**
     * Obtém o texto do tipo de transação
     */
    private getTransactionTypeText;
    /**
     * Obtém o texto do status da transação
     */
    private getTransactionStatusText;
}
