import { Request, Response, NextFunction } from 'express';
/**
 * Controlador para usuários
 */
export declare class UserController {
    /**
     * Obtém todos os usuários
     */
    static getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém um usuário pelo ID
     */
    static getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Atualiza um usuário existente
     */
    static updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove um usuário
     */
    static deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
