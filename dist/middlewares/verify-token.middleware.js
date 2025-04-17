"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const models_1 = require("../models");
/**
 * Middleware para verificar o token JWT
 * Usado para testar a autenticação
 */
const verifyToken = async (req, res, next) => {
    try {
        // Verificar se o token existe no header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                status: 'error',
                message: 'Acesso não autorizado. Token não fornecido.'
            });
            return;
        }
        // Verificar e decodificar o token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Verificar se o usuário existe
        const user = await models_1.User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Usuário não encontrado ou token inválido.'
            });
            return;
        }
        // Adicionar o usuário à requisição
        req.user = user;
        // Continuar para o próximo middleware
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Token inválido ou expirado.'
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verify-token.middleware.js.map