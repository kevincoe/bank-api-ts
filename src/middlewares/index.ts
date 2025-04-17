import { Request, Response, NextFunction } from 'express';
import { validate } from './common.middleware';
import { verifyToken } from './verify-token.middleware';
import { SecurityMiddlewareImpl } from './security.middleware';

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

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
};

// Create validateJSON middleware
const validateJSON = (req: Request, res: Response, next: NextFunction): void => {
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && 
      req.headers['content-type'] === 'application/json') {
    try {
      if (req.body && typeof req.body === 'object') {
        next();
      } else {
        throw new Error('Invalid JSON');
      }
    } catch (e) {
      res.status(400).json({ 
        status: 'error',
        message: 'Invalid JSON in request body'
      });
      return;
    }
  }
  next();
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
  requestLogger,
  validateJSON
};