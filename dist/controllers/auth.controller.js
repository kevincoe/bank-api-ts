"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../services");
const error_utils_1 = require("../utils/error.utils");
/**
 * Controlador para autenticação
 */
class AuthController {
    /**
     * Registra um novo usuário
     */
    static async register(req, res, next) {
        try {
            const { name, email, password, cpf, phone, address } = req.body;
            const result = await services_1.authService.register({
                name,
                email,
                password,
                cpf,
                phone,
                address,
                role: 'client' // Por padrão, novos usuários são clientes
            });
            // Remover a senha do objeto de resposta
            const user = result.user.toObject();
            delete user.password;
            res.status(201).json({
                status: 'success',
                data: {
                    user,
                    token: result.token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Autentica um usuário existente
     */
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new error_utils_1.AppError('Email e senha são obrigatórios', 400);
            }
            const result = await services_1.authService.login(email, password);
            // Remover a senha do objeto de resposta
            const user = result.user.toObject();
            delete user.password;
            res.status(200).json({
                status: 'success',
                data: {
                    user,
                    token: result.token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map