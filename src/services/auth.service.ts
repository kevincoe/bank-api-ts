import { IUserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/error.utils';
import { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config/config';

/**
 * Interface para o serviço de autenticação
 */
export interface IAuthService {
  register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
}

/**
 * Implementação do serviço de autenticação
 */
export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Registra um novo usuário
   */
  async register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    // Verificar se o email já está em uso
    const existingEmail = await this.userRepository.findByEmail(userData.email as string);
    if (existingEmail) {
      throw new AppError('Email já está em uso', 409);
    }

    // Verificar se o CPF já está em uso
    const existingCpf = await this.userRepository.findByCpf(userData.cpf as string);
    if (existingCpf) {
      throw new AppError('CPF já está em uso', 409);
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
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    // Buscar usuário pelo email com senha incluída
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Gera um token JWT para o usuário
   */
  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}
