"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const error_utils_1 = require("../utils/error.utils");
/**
 * Implementação do serviço de usuários
 */
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Obtém todos os usuários
     */
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    /**
     * Obtém um usuário pelo ID
     */
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new error_utils_1.AppError('Usuário não encontrado', 404);
        }
        return user;
    }
    /**
     * Atualiza um usuário existente
     */
    async updateUser(id, userData) {
        // Verificar se o usuário existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new error_utils_1.AppError('Usuário não encontrado', 404);
        }
        // Verificar se o email já está em uso por outro usuário
        if (userData.email && userData.email !== existingUser.email) {
            const emailExists = await this.userRepository.findByEmail(userData.email);
            if (emailExists) {
                throw new error_utils_1.AppError('Email já está em uso', 409);
            }
        }
        // Verificar se o CPF já está em uso por outro usuário
        if (userData.cpf && userData.cpf !== existingUser.cpf) {
            const cpfExists = await this.userRepository.findByCpf(userData.cpf);
            if (cpfExists) {
                throw new error_utils_1.AppError('CPF já está em uso', 409);
            }
        }
        // Atualizar o usuário
        const updatedUser = await this.userRepository.update(id, userData);
        if (!updatedUser) {
            throw new error_utils_1.AppError('Erro ao atualizar usuário', 500);
        }
        return updatedUser;
    }
    /**
     * Remove um usuário
     */
    async deleteUser(id) {
        // Verificar se o usuário existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new error_utils_1.AppError('Usuário não encontrado', 404);
        }
        // Remover o usuário
        const result = await this.userRepository.delete(id);
        if (!result) {
            throw new error_utils_1.AppError('Erro ao remover usuário', 500);
        }
        return true;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map