"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const error_utils_1 = require("../utils/error.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Implementação do serviço de autenticação
 */
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Registra um novo usuário
     */
    async register(userData) {
        // Verificar se o email já está em uso
        const existingEmail = await this.userRepository.findByEmail(userData.email);
        if (existingEmail) {
            throw new error_utils_1.AppError('Email já está em uso', 409);
        }
        // Verificar se o CPF já está em uso
        const existingCpf = await this.userRepository.findByCpf(userData.cpf);
        if (existingCpf) {
            throw new error_utils_1.AppError('CPF já está em uso', 409);
        }
        // Criar o usuário
        const user = await this.userRepository.create(userData);
        // Gerar token JWT
        const token = this.generateToken(user);
        return { user, token };
    }
    /**
     * Autentica um usuário existente
     */
    async login(email, password) {
        // Buscar usuário pelo email com senha incluída
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new error_utils_1.AppError('Credenciais inválidas', 401);
        }
        // Verificar senha
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new error_utils_1.AppError('Credenciais inválidas', 401);
        }
        // Gerar token JWT
        const token = this.generateToken(user);
        return { user, token };
    }
    /**
     * Gera um token JWT para o usuário
     */
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.jwtSecret, { expiresIn: config_1.default.jwtExpiresIn });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map