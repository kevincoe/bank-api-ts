import { IUserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/error.utils';
import { IUser } from '../models/user.model';

/**
 * Interface para o serviço de usuários
 */
export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser>;
  deleteUser(id: string): Promise<boolean>;
}

/**
 * Implementação do serviço de usuários
 */
export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Obtém todos os usuários
   */
  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  /**
   * Obtém um usuário pelo ID
   */
  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user;
  }

  /**
   * Atualiza um usuário existente
   */
  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar se o email já está em uso por outro usuário
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new AppError('Email já está em uso', 409);
      }
    }

    // Verificar se o CPF já está em uso por outro usuário
    if (userData.cpf && userData.cpf !== existingUser.cpf) {
      const cpfExists = await this.userRepository.findByCpf(userData.cpf);
      if (cpfExists) {
        throw new AppError('CPF já está em uso', 409);
      }
    }

    // Atualizar o usuário
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new AppError('Erro ao atualizar usuário', 500);
    }

    return updatedUser;
  }

  /**
   * Remove um usuário
   */
  async deleteUser(id: string): Promise<boolean> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Remover o usuário
    const result = await this.userRepository.delete(id);
    if (!result) {
      throw new AppError('Erro ao remover usuário', 500);
    }

    return true;
  }
}
