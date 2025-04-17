"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
/**
 * Controlador para usuários
 */
class UserController {
    /**
     * Obtém todos os usuários
     */
    static async getAllUsers(req, res, next) {
        try {
            const users = await services_1.userService.getAllUsers();
            res.status(200).json({
                status: 'success',
                results: users.length,
                data: {
                    users
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém um usuário pelo ID
     */
    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await services_1.userService.getUserById(id);
            res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Atualiza um usuário existente
     */
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, cpf, phone, address } = req.body;
            const updatedUser = await services_1.userService.updateUser(id, {
                name,
                email,
                cpf,
                phone,
                address
            });
            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove um usuário
     */
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await services_1.userService.deleteUser(id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map