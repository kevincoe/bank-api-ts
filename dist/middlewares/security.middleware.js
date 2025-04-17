"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = exports.SecurityMiddlewareImpl = void 0;
const error_utils_1 = require("../utils/error.utils");
/**
 * Implementação do middleware de segurança
 */
class SecurityMiddlewareImpl {
    /**
     * Valida o tipo de conteúdo da requisição
     */
    validateContentType(req, res, next) {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                return next(error_utils_1.AppError.badRequest('O tipo de conteúdo deve ser application/json'));
            }
        }
        next();
    }
    /**
     * Previne ataques de injeção NoSQL
     */
    preventNoSql(req, res, next) {
        // Verificar parâmetros de consulta
        if (req.query) {
            for (const [key, value] of Object.entries(req.query)) {
                if (typeof value === 'string' && (value.includes('$') || value.includes('{'))) {
                    return next(error_utils_1.AppError.badRequest('Caracteres inválidos nos parâmetros de consulta'));
                }
            }
        }
        // Verificar corpo da requisição
        if (req.body && typeof req.body === 'object') {
            const checkForOperators = (obj) => {
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
                return next(error_utils_1.AppError.badRequest('Caracteres inválidos no corpo da requisição'));
            }
        }
        next();
    }
    /**
     * Sanitiza os dados da requisição
     */
    sanitizeData(req, res, next) {
        // Função para sanitizar strings
        const sanitizeString = (str) => {
            return str
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };
        // Função para sanitizar objeto
        const sanitizeObject = (obj) => {
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            const result = Array.isArray(obj) ? [] : {};
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    result[key] = sanitizeString(value);
                }
                else if (typeof value === 'object' && value !== null) {
                    result[key] = sanitizeObject(value);
                }
                else {
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
    securityHeaders(req, res, next) {
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
exports.SecurityMiddlewareImpl = SecurityMiddlewareImpl;
// Exportar instância do middleware de segurança
exports.securityMiddleware = new SecurityMiddlewareImpl();
//# sourceMappingURL=security.middleware.js.map