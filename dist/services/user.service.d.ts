import { IUserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
/**
 * Interface para o serviço de usuários
 */
export interface IUserService {
    getAllUsers(): Promise<IUser[]>;
    getUserById(id: string): Promise<IUser>;
    updateUser(id: string, userData: Partial<IUser>): Promise<IUser>;
    deleteUser(id: string): Promise<boolean>;
}
/**
 * Implementação do serviço de usuários
 */
export declare class UserService implements IUserService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    /**
     * Obtém todos os usuários
     */
    getAllUsers(): Promise<IUser[]>;
    /**
     * Obtém um usuário pelo ID
     */
    getUserById(id: string): Promise<IUser>;
    /**
     * Atualiza um usuário existente
     */
    updateUser(id: string, userData: Partial<IUser>): Promise<IUser>;
    /**
     * Remove um usuário
     */
    deleteUser(id: string): Promise<boolean>;
}
