import { Request, Response, NextFunction } from 'express';
export declare const validate: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para logging de requisições
 */
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para tratamento de rotas não encontradas
 */
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para limitar taxa de requisições
 */
export declare const rateLimit: (maxRequests: number, timeWindow: number) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para verificar conteúdo JSON
 */
export declare const validateJSON: (req: Request, res: Response, next: NextFunction) => void;
