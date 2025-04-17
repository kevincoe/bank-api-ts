import { Request, Response, NextFunction } from 'express';
/**
 * Interface para o middleware de segurança
 */
export interface SecurityMiddleware {
    validateContentType(req: Request, res: Response, next: NextFunction): void;
    preventNoSql(req: Request, res: Response, next: NextFunction): void;
    sanitizeData(req: Request, res: Response, next: NextFunction): void;
    securityHeaders(req: Request, res: Response, next: NextFunction): void;
}
/**
 * Implementação do middleware de segurança
 */
export declare class SecurityMiddlewareImpl implements SecurityMiddleware {
    /**
     * Valida o tipo de conteúdo da requisição
     */
    validateContentType(req: Request, res: Response, next: NextFunction): void;
    /**
     * Previne ataques de injeção NoSQL
     */
    preventNoSql(req: Request, res: Response, next: NextFunction): void;
    /**
     * Sanitiza os dados da requisição
     */
    sanitizeData(req: Request, res: Response, next: NextFunction): void;
    /**
     * Adiciona cabeçalhos de segurança
     */
    securityHeaders(req: Request, res: Response, next: NextFunction): void;
}
export declare const securityMiddleware: SecurityMiddlewareImpl;
