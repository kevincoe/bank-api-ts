import { Request, Response, NextFunction } from 'express';
import { validate } from './common.middleware';
import { verifyToken } from './verify-token.middleware';
import { SecurityMiddlewareImpl } from './security.middleware';
import { IUser } from '../models/user.model';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
declare const securityMiddleware: SecurityMiddlewareImpl;
declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
declare const authorize: (role: string) => (req: Request, res: Response, next: NextFunction) => void;
declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
declare const rateLimit: any;
export { authenticate, authorize, validate, verifyToken, securityMiddleware, notFound, rateLimit };
