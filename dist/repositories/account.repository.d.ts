import { IAccount } from '../models/account.model';
/**
 * Interface para o repositório de contas
 */
export interface IAccountRepository {
    findAll(): Promise<IAccount[]>;
    findById(id: string): Promise<IAccount | null>;
    findByAccountNumber(accountNumber: string): Promise<IAccount | null>;
    findByUserId(userId: string): Promise<IAccount[]>;
    create(accountData: Partial<IAccount>): Promise<IAccount>;
    update(id: string, accountData: Partial<IAccount>): Promise<IAccount | null>;
    updateBalance(id: string, amount: number): Promise<IAccount | null>;
    delete(id: string): Promise<boolean>;
}
/**
 * Implementação do repositório de contas
 */
export declare class AccountRepository implements IAccountRepository {
    private Account;
    constructor(Account: any);
    /**
     * Encontra todas as contas
     */
    findAll(): Promise<IAccount[]>;
    /**
     * Encontra uma conta pelo ID
     */
    findById(id: string): Promise<IAccount | null>;
    /**
     * Encontra uma conta pelo número
     */
    findByAccountNumber(accountNumber: string): Promise<IAccount | null>;
    /**
     * Encontra todas as contas de um usuário
     */
    findByUserId(userId: string): Promise<IAccount[]>;
    /**
     * Cria uma nova conta
     */
    create(accountData: Partial<IAccount>): Promise<IAccount>;
    /**
     * Atualiza uma conta existente
     */
    update(id: string, accountData: Partial<IAccount>): Promise<IAccount | null>;
    /**
     * Atualiza o saldo de uma conta
     */
    updateBalance(id: string, amount: number): Promise<IAccount | null>;
    /**
     * Remove uma conta
     */
    delete(id: string): Promise<boolean>;
}
