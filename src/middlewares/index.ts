import { Request, Response, NextFunction } from 'express';
import { validate } from './common.middleware';
import { verifyToken } from './verify-token.middleware';
import { SecurityMiddlewareImpl } from './security.middleware';
import { IUser } from '../models/user.model';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const securityMiddleware = new SecurityMiddlewareImpl();

// Create authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  verifyToken(req, res, next);
};

// Create authorization middleware
const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({
        status: 'error',
        message: 'Acesso proibido'
      });
      return;
    }
    next();
  };
};

// Fix type definitions for other middlewares
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Create rate limiting middleware
const rateLimit = require('express-rate-limit');

export {
  authenticate,
  authorize,
  validate,
  verifyToken,
  securityMiddleware,
  notFound,
  rateLimit
};