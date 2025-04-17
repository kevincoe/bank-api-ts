import { Request, Response, NextFunction } from 'express';
/**
 * Controlador para autenticação
 */
export declare class AuthController {
    /**
     * Registra um novo usuário
     */
    static register(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Autentica um usuário existente
     */
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
}
