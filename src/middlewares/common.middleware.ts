import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/error.utils';

/**
 * Middleware para validação de requisições
 */

interface RequestsMap {
  [key: string]: number[];
}

const requests: RequestsMap = {};


export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    const errorDetails = errors.array().reduce((acc: any, error: any) => {
      const field = error.param;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(error.msg);
      return acc;
    }, {});
    
    next(new AppError(errorMessages, 400, true, errorDetails));
    return;
  }
  next();
};

/**
 * Middleware para logging de requisições
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  // Medir tempo de resposta
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`);
  });
  
  next();
};

/**
 * Middleware para tratamento de rotas não encontradas
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Rota não encontrada - ${req.originalUrl}`));
};

/**
 * Middleware para limitar taxa de requisições
 */
export const rateLimit = (maxRequests: number, timeWindow: number) => {
  const requests: Record<string, number[]> = {};
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip as string;
    const now = Date.now();
    
    // Inicializar array de timestamps para o IP
    if (!requests[ip]) {
      requests[ip] = [];
    }
    
    // Remover timestamps antigos
    requests[ip] = requests[ip].filter(timestamp => now - timestamp < timeWindow);
    
    // Verificar se excedeu o limite
    if (requests[ip].length >= maxRequests) {
      next(new AppError('Muitas requisições. Por favor, tente novamente mais tarde.', 429));
      return;
    }
    
    // Adicionar timestamp atual
    requests[ip].push(now);
    
    next();
  };
};

/**
 * Middleware para verificar conteúdo JSON
 */
export const validateJSON = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (req.headers['content-type'] !== 'application/json') {
      next(new AppError('O tipo de conteúdo deve ser application/json', 415));
      return;
    }
  }
  next();
};
