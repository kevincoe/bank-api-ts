"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const error_utils_1 = require("../utils/error.utils");
const models_1 = require("../models");
/**
 * Middleware para verificar se o usuário está autenticado
 */
const authenticate = async (req, res, next) => {
    try {
        // Verificar se o token existe
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_utils_1.AppError('Acesso não autorizado. Token não fornecido.', 401);
        }
        // Extrair o token
        const token = authHeader.split(' ')[1];
        // Verificar e decodificar o token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Verificar se o usuário ainda existe
        const user = await models_1.User.findById(decoded.id);
        if (!user) {
            throw new error_utils_1.AppError('O usuário associado a este token não existe mais.', 401);
        }
        // Adicionar o usuário ao objeto de requisição
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new error_utils_1.AppError('Token inválido ou expirado.', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
/**
 * Middleware para verificar permissões de usuário
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            next(new error_utils_1.AppError('Acesso não autorizado. Faça login primeiro.', 401));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new error_utils_1.AppError('Você não tem permissão para acessar este recurso.', 403));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map