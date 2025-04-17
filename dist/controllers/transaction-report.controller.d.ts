import { Request, Response, NextFunction } from 'express';
/**
 * Controlador para relatórios de transações
 */
export declare class TransactionReportController {
    /**
     * Gera um recibo para uma transação
     */
    static generateReceipt(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Obtém um resumo das transações de uma conta
     */
    static getTransactionSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Calcula o saldo de uma conta em um período
     */
    static calculateAccountBalance(req: Request, res: Response, next: NextFunction): Promise<void>;
}
