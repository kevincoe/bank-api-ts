import { IUserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
/**
 * Interface para o serviço de autenticação
 */
export interface IAuthService {
    register(userData: Partial<IUser>): Promise<{
        user: IUser;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
}
/**
 * Implementação do serviço de autenticação
 */
export declare class AuthService implements IAuthService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    /**
     * Registra um novo usuário
     */
    register(userData: Partial<IUser>): Promise<{
        user: IUser;
        token: string;
    }>;
    /**
     * Autentica um usuário existente
     */
    login(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
    /**
     * Gera um token JWT para o usuário
     */
    private generateToken;
}
