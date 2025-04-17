import { IUser } from '../models/user.model';
/**
 * Interface para o repositório de usuários
 */
export interface IUserRepository {
    findAll(): Promise<IUser[]>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByCpf(cpf: string): Promise<IUser | null>;
    create(userData: Partial<IUser>): Promise<IUser>;
    update(id: string, userData: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
}
/**
 * Implementação do repositório de usuários
 */
export declare class UserRepository implements IUserRepository {
    private User;
    constructor(User: any);
    /**
     * Encontra todos os usuários
     */
    findAll(): Promise<IUser[]>;
    /**
     * Encontra um usuário pelo ID
     */
    findById(id: string): Promise<IUser | null>;
    /**
     * Encontra um usuário pelo email
     */
    findByEmail(email: string): Promise<IUser | null>;
    /**
     * Encontra um usuário pelo CPF
     */
    findByCpf(cpf: string): Promise<IUser | null>;
    /**
     * Cria um novo usuário
     */
    create(userData: Partial<IUser>): Promise<IUser>;
    /**
     * Atualiza um usuário existente
     */
    update(id: string, userData: Partial<IUser>): Promise<IUser | null>;
    /**
     * Remove um usuário
     */
    delete(id: string): Promise<boolean>;
}
