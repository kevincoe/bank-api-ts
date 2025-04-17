import { IAccountRepository } from '../repositories/account.repository';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { ITransaction } from '../models/transaction.model';
/**
 * Interface para o serviço de transações
 */
export interface ITransactionService {
    getAllTransactions(): Promise<ITransaction[]>;
    getTransactionById(id: string): Promise<ITransaction>;
    getAccountTransactions(accountId: string): Promise<ITransaction[]>;
    deposit(destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    withdraw(sourceAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    transfer(sourceAccountId: string, destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    cancelTransaction(id: string): Promise<ITransaction>;
}
/**
 * Implementação do serviço de transações
 */
export declare class TransactionService implements ITransactionService {
    private transactionRepository;
    private accountRepository;
    constructor(transactionRepository: ITransactionRepository, accountRepository: IAccountRepository);
    /**
     * Obtém todas as transações
     */
    getAllTransactions(): Promise<ITransaction[]>;
    /**
     * Obtém uma transação pelo ID
     */
    getTransactionById(id: string): Promise<ITransaction>;
    /**
     * Obtém todas as transações de uma conta
     */
    getAccountTransactions(accountId: string): Promise<ITransaction[]>;
    /**
     * Realiza um depósito em uma conta
     */
    deposit(destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Realiza um saque de uma conta
     */
    withdraw(sourceAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Realiza uma transferência entre contas
     */
    transfer(sourceAccountId: string, destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
    /**
     * Cancela uma transação pendente
     */
    cancelTransaction(id: string): Promise<ITransaction>;
}
