"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
/**
 * Implementação do repositório de usuários
 */
class UserRepository {
    constructor(User) {
        this.User = User;
    }
    /**
     * Encontra todos os usuários
     */
    async findAll() {
        return this.User.find().select('-password');
    }
    /**
     * Encontra um usuário pelo ID
     */
    async findById(id) {
        return this.User.findById(id).select('-password');
    }
    /**
     * Encontra um usuário pelo email
     */
    async findByEmail(email) {
        return this.User.findOne({ email });
    }
    /**
     * Encontra um usuário pelo CPF
     */
    async findByCpf(cpf) {
        return this.User.findOne({ cpf });
    }
    /**
     * Cria um novo usuário
     */
    async create(userData) {
        return this.User.create(userData);
    }
    /**
     * Atualiza um usuário existente
     */
    async update(id, userData) {
        return this.User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).select('-password');
    }
    /**
     * Remove um usuário
     */
    async delete(id) {
        const result = await this.User.findByIdAndDelete(id);
        return !!result;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map