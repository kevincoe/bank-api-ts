import { ITransaction, TransactionStatus } from '../models/transaction.model';
/**
 * Interface para o repositório de transações
 */
export interface ITransactionRepository {
    findAll(): Promise<ITransaction[]>;
    findById(id: string): Promise<ITransaction | null>;
    findBySourceAccount(accountId: string): Promise<ITransaction[]>;
    findByDestinationAccount(accountId: string): Promise<ITransaction[]>;
    findByAccountId(accountId: string): Promise<ITransaction[]>;
    findByStatus(status: TransactionStatus): Promise<ITransaction[]>;
    create(transactionData: Partial<ITransaction>): Promise<ITransaction>;
    updateStatus(id: string, status: TransactionStatus): Promise<ITransaction | null>;
    delete(id: string): Promise<boolean>;
}
/**
 * Implementação do repositório de transações
 */
export declare class TransactionRepository implements ITransactionRepository {
    private Transaction;
    constructor(Transaction: any);
    /**
     * Encontra todas as transações
     */
    findAll(): Promise<ITransaction[]>;
    /**
     * Encontra uma transação pelo ID
     */
    findById(id: string): Promise<ITransaction | null>;
    /**
     * Encontra transações pela conta de origem
     */
    findBySourceAccount(accountId: string): Promise<ITransaction[]>;
    /**
     * Encontra transações pela conta de destino
     */
    findByDestinationAccount(accountId: string): Promise<ITransaction[]>;
    /**
     * Encontra transações por conta (origem ou destino)
     */
    findByAccountId(accountId: string): Promise<ITransaction[]>;
    /**
     * Encontra transações por status
     */
    findByStatus(status: TransactionStatus): Promise<ITransaction[]>;
    /**
     * Cria uma nova transação
     */
    create(transactionData: Partial<ITransaction>): Promise<ITransaction>;
    /**
     * Atualiza o status de uma transação
     */
    updateStatus(id: string, status: TransactionStatus): Promise<ITransaction | null>;
    /**
     * Remove uma transação
     */
    delete(id: string): Promise<boolean>;
}
