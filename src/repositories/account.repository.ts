import { IAccount } from '../models/account.model';

/**
 * Interface para o repositório de contas
 */
export interface IAccountRepository {
  findAll(): Promise<IAccount[]>;
  findById(id: string): Promise<IAccount | null>;
  findByAccountNumber(accountNumber: string): Promise<IAccount | null>;
  findByUserId(userId: string): Promise<IAccount[]>;
  create(accountData: Partial<IAccount>): Promise<IAccount>;
  update(id: string, accountData: Partial<IAccount>): Promise<IAccount | null>;
  updateBalance(id: string, amount: number): Promise<IAccount | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Implementação do repositório de contas
 */
export class AccountRepository implements IAccountRepository {
  private Account: any;

  constructor(Account: any) {
    this.Account = Account;
  }

  /**
   * Encontra todas as contas
   */
  async findAll(): Promise<IAccount[]> {
    return this.Account.find().populate('user', 'name email');
  }

  /**
   * Encontra uma conta pelo ID
   */
  async findById(id: string): Promise<IAccount | null> {
    return this.Account.findById(id).populate('user', 'name email');
  }

  /**
   * Encontra uma conta pelo número
   */
  async findByAccountNumber(accountNumber: string): Promise<IAccount | null> {
    return this.Account.findOne({ accountNumber }).populate('user', 'name email');
  }

  /**
   * Encontra todas as contas de um usuário
   */
  async findByUserId(userId: string): Promise<IAccount[]> {
    return this.Account.find({ user: userId });
  }

  /**
   * Cria uma nova conta
   */
  async create(accountData: Partial<IAccount>): Promise<IAccount> {
    return this.Account.create(accountData);
  }

  /**
   * Atualiza uma conta existente
   */
  async update(id: string, accountData: Partial<IAccount>): Promise<IAccount | null> {
    return this.Account.findByIdAndUpdate(
      id,
      accountData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
  }

  /**
   * Atualiza o saldo de uma conta
   */
  async updateBalance(id: string, amount: number): Promise<IAccount | null> {
    const account = await this.Account.findById(id);
    if (!account) return null;

    account.balance += amount;
    await account.save();
    
    return account;
  }

  /**
   * Remove uma conta
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.Account.findByIdAndDelete(id);
    return !!result;
  }
}
