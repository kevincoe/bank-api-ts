import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils';

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
export class SecurityMiddlewareImpl implements SecurityMiddleware {
  /**
   * Valida o tipo de conteúdo da requisição
   */
  validateContentType(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return next(AppError.badRequest('O tipo de conteúdo deve ser application/json'));
      }
    }
    next();
  }

  /**
   * Previne ataques de injeção NoSQL
   */
  preventNoSql(req: Request, res: Response, next: NextFunction): void {
    // Verificar parâmetros de consulta
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string' && (value.includes('$') || value.includes('{'))) {
          return next(AppError.badRequest('Caracteres inválidos nos parâmetros de consulta'));
        }
      }
    }

    // Verificar corpo da requisição
    if (req.body && typeof req.body === 'object') {
      const checkForOperators = (obj: any): boolean => {
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith('$')) {
            return true;
          }
          if (typeof value === 'object' && value !== null) {
            if (checkForOperators(value)) {
              return true;
            }
          }
        }
        return false;
      };

      if (checkForOperators(req.body)) {
        return next(AppError.badRequest('Caracteres inválidos no corpo da requisição'));
      }
    }

    next();
  }

  /**
   * Sanitiza os dados da requisição
   */
  sanitizeData(req: Request, res: Response, next: NextFunction): void {
    // Função para sanitizar strings
    const sanitizeString = (str: string): string => {
      return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    // Função para sanitizar objeto
    const sanitizeObject = (obj: any): any => {
      if (!obj || typeof obj !== 'object') {
        return obj;
      }

      const result: any = Array.isArray(obj) ? [] : {};

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          result[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }

      return result;
    };

    // Sanitizar corpo da requisição
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitizar parâmetros de consulta
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          req.query[key] = sanitizeString(value);
        }
      }
    }

    next();
  }

  /**
   * Adiciona cabeçalhos de segurança
   */
  securityHeaders(req: Request, res: Response, next: NextFunction): void {
    // Prevenir clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevenir MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Habilitar proteção XSS no navegador
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Restringir origens de recursos
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    // Restringir informações de referência
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    
    next();
  }
}

// Exportar instância do middleware de segurança
export const securityMiddleware = new SecurityMiddlewareImpl();
