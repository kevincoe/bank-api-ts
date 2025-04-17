import { Request, Response, NextFunction } from 'express';
/**
 * Controlador para contas
 */
export declare class AccountController {
    /**
     * Obtém todas as contas
     */
    static getAllAccounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém uma conta pelo ID
     */
    static getAccountById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém uma conta pelo número
     */
    static getAccountByNumber(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém todas as contas de um usuário
     */
    static getUserAccounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cria uma nova conta
     */
    static createAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Atualiza uma conta existente
     */
    static updateAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Desativa uma conta
     */
    static deactivateAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove uma conta
     */
    static deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
