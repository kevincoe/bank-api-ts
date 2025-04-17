import { Request, Response, NextFunction } from 'express';
/**
 * Middleware para verificar o token JWT
 * Usado para testar a autenticação
 */
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
