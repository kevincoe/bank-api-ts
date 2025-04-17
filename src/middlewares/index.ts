import { authenticate, authorize, validate } from './common.middleware';
import { verifyToken } from './verify-token.middleware';
import { SecurityMiddlewareImpl } from './security.middleware';

/**
 * Arquivo de índice para exportar todos os middlewares
 * Facilita a importação em outros arquivos
 */

// Create the security middleware instance
const securityMiddleware = new SecurityMiddlewareImpl();

// Create notFound middleware
const notFound = (req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Create requestLogger middleware (simplified version)
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
};

// Create validateJSON middleware
const validateJSON = (req, res, next) => {
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
  validateJSON,
  rateLimit
};