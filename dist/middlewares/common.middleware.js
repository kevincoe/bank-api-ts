"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJSON = exports.rateLimit = exports.notFound = exports.requestLogger = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const error_utils_1 = require("../utils/error.utils");
const requests = {};
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        const errorDetails = errors.array().reduce((acc, error) => {
            const field = error.param;
            if (!acc[field]) {
                acc[field] = [];
            }
            acc[field].push(error.msg);
            return acc;
        }, {});
        next(new error_utils_1.AppError(errorMessages, 400, true, errorDetails));
        return;
    }
    next();
};
exports.validate = validate;
/**
 * Middleware para logging de requisições
 */
const requestLogger = (req, res, next) => {
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
exports.requestLogger = requestLogger;
/**
 * Middleware para tratamento de rotas não encontradas
 */
const notFound = (req, res, next) => {
    next(error_utils_1.AppError.notFound(`Rota não encontrada - ${req.originalUrl}`));
};
exports.notFound = notFound;
/**
 * Middleware para limitar taxa de requisições
 */
const rateLimit = (maxRequests, timeWindow) => {
    const requests = {};
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        // Inicializar array de timestamps para o IP
        if (!requests[ip]) {
            requests[ip] = [];
        }
        // Remover timestamps antigos
        requests[ip] = requests[ip].filter(timestamp => now - timestamp < timeWindow);
        // Verificar se excedeu o limite
        if (requests[ip].length >= maxRequests) {
            next(new error_utils_1.AppError('Muitas requisições. Por favor, tente novamente mais tarde.', 429));
            return;
        }
        // Adicionar timestamp atual
        requests[ip].push(now);
        next();
    };
};
exports.rateLimit = rateLimit;
/**
 * Middleware para verificar conteúdo JSON
 */
const validateJSON = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (req.headers['content-type'] !== 'application/json') {
            next(new error_utils_1.AppError('O tipo de conteúdo deve ser application/json', 415));
            return;
        }
    }
    next();
};
exports.validateJSON = validateJSON;
//# sourceMappingURL=common.middleware.js.map