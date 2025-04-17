import { IAccountRepository } from '../repositories/account.repository';
import { IAccount } from '../models/account.model';
/**
 * Interface para o serviço de contas
 */
export interface IAccountService {
    getAllAccounts(): Promise<IAccount[]>;
    getAccountById(id: string): Promise<IAccount>;
    getAccountByNumber(accountNumber: string): Promise<IAccount>;
    getUserAccounts(userId: string): Promise<IAccount[]>;
    createAccount(accountData: Partial<IAccount>): Promise<IAccount>;
    updateAccount(id: string, accountData: Partial<IAccount>): Promise<IAccount>;
    deactivateAccount(id: string): Promise<IAccount>;
    deleteAccount(id: string): Promise<boolean>;
}
/**
 * Implementação do serviço de contas
 */
export declare class AccountService implements IAccountService {
    private accountRepository;
    constructor(accountRepository: IAccountRepository);
    /**
     * Obtém todas as contas
     */
    getAllAccounts(): Promise<IAccount[]>;
    /**
     * Obtém uma conta pelo ID
     */
    getAccountById(id: string): Promise<IAccount>;
    /**
     * Obtém uma conta pelo número
     */
    getAccountByNumber(accountNumber: string): Promise<IAccount>;
    /**
     * Obtém todas as contas de um usuário
     */
    getUserAccounts(userId: string): Promise<IAccount[]>;
    /**
     * Cria uma nova conta
     */
    createAccount(accountData: Partial<IAccount>): Promise<IAccount>;
    /**
     * Atualiza uma conta existente
     */
    updateAccount(id: string, accountData: Partial<IAccount>): Promise<IAccount>;
    /**
     * Desativa uma conta
     */
    deactivateAccount(id: string): Promise<IAccount>;
    /**
     * Remove uma conta
     */
    deleteAccount(id: string): Promise<boolean>;
}
