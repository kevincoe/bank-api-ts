"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJSON = exports.requestLogger = exports.notFound = exports.securityMiddleware = exports.verifyToken = exports.validate = exports.authorize = exports.authenticate = void 0;
const common_middleware_1 = require("./common.middleware");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return common_middleware_1.validate; } });
const verify_token_middleware_1 = require("./verify-token.middleware");
Object.defineProperty(exports, "verifyToken", { enumerable: true, get: function () { return verify_token_middleware_1.verifyToken; } });
const security_middleware_1 = require("./security.middleware");
const securityMiddleware = new security_middleware_1.SecurityMiddlewareImpl();
exports.securityMiddleware = securityMiddleware;
// Create authentication middleware
const authenticate = (req, res, next) => {
    (0, verify_token_middleware_1.verifyToken)(req, res, next);
};
exports.authenticate = authenticate;
// Create authorization middleware
const authorize = (role) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
// Fix type definitions for other middlewares
const notFound = (req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
// Create validateJSON middleware
const validateJSON = (req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') &&
        req.headers['content-type'] === 'application/json') {
        try {
            if (req.body && typeof req.body === 'object') {
                next();
            }
            else {
                throw new Error('Invalid JSON');
            }
        }
        catch (e) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid JSON in request body'
            });
            return;
        }
    }
    next();
};
exports.validateJSON = validateJSON;
// Create rate limiting middleware
const rateLimit = require('express-rate-limit');
//# sourceMappingURL=index.js.map