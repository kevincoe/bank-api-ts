import { Request, Response, NextFunction } from 'express';
/**
 * Controlador para transações
 */
export declare class TransactionController {
    /**
     * Obtém todas as transações
     */
    static getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém uma transação pelo ID
     */
    static getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém todas as transações de uma conta
     */
    static getAccountTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Realiza um depósito em uma conta
     */
    static deposit(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Realiza um saque de uma conta
     */
    static withdraw(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Realiza uma transferência entre contas
     */
    static transfer(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cancela uma transação pendente
     */
    static cancelTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
}
