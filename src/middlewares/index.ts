import { authenticate, authorize, validate } from './common.middleware';
import { verifyToken } from './verify-token.middleware';
import { securityMiddleware } from './security.middleware';

/**
 * Arquivo de índice para exportar todos os middlewares
 * Facilita a importação em outros arquivos
 */

export {
  authenticate,
  authorize,
  validate,
  verifyToken,
  securityMiddleware
};

// Exportar também as funções individuais do middleware de segurança
export const validateContentType = securityMiddleware.validateContentType.bind(securityMiddleware);
export const preventNoSql = securityMiddleware.preventNoSql.bind(securityMiddleware);
export const sanitizeData = securityMiddleware.sanitizeData.bind(securityMiddleware);
export const securityHeaders = securityMiddleware.securityHeaders.bind(securityMiddleware);
