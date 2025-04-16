import { IUser } from '../models/user.model';

/**
 * Interface para o repositório de usuários
 */
export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByCpf(cpf: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Implementação do repositório de usuários
 */
export class UserRepository implements IUserRepository {
  private User: any;

  constructor(User: any) {
    this.User = User;
  }

  /**
   * Encontra todos os usuários
   */
  async findAll(): Promise<IUser[]> {
    return this.User.find().select('-password');
  }

  /**
   * Encontra um usuário pelo ID
   */
  async findById(id: string): Promise<IUser | null> {
    return this.User.findById(id).select('-password');
  }

  /**
   * Encontra um usuário pelo email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return this.User.findOne({ email });
  }

  /**
   * Encontra um usuário pelo CPF
   */
  async findByCpf(cpf: string): Promise<IUser | null> {
    return this.User.findOne({ cpf });
  }

  /**
   * Cria um novo usuário
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    return this.User.create(userData);
  }

  /**
   * Atualiza um usuário existente
   */
  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return this.User.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  /**
   * Remove um usuário
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.User.findByIdAndDelete(id);
    return !!result;
  }
}
