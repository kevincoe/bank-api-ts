import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models';
/**
 * Middleware para verificar se o usuário está autenticado
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware para verificar permissões de usuário
 */
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
