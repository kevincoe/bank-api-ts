import { IAccountRepository } from '../repositories/account.repository';
import { AppError } from '../utils/error.utils';
import { IAccount, AccountType } from '../models/account.model';

/**
 * Interface para o serviço de contas
 */
export interface IAccountService {
  getAllAccounts(): Promise<IAccount[]>;
  getAccountById(id: string): Promise<IAccount>;
  getAccountByNumber(accountNumber: string): Promise<IAccount>;
  getUserAccounts(userId: string): Promise<IAccount[]>;
  createAccount(accountData: Partial<IAccount>): Promise<IAccount>;
  updateAccount(id: string, accountData: Partial<IAccount>): Promise<IAccount>;
  deactivateAccount(id: string): Promise<IAccount>;
  deleteAccount(id: string): Promise<boolean>;
}

/**
 * Implementação do serviço de contas
 */
export class AccountService implements IAccountService {
  constructor(private accountRepository: IAccountRepository) {}

  /**
   * Obtém todas as contas
   */
  async getAllAccounts(): Promise<IAccount[]> {
    return this.accountRepository.findAll();
  }

  /**
   * Obtém uma conta pelo ID
   */
  async getAccountById(id: string): Promise<IAccount> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new AppError('Conta não encontrada', 404);
    }
    return account;
  }

  /**
   * Obtém uma conta pelo número
   */
  async getAccountByNumber(accountNumber: string): Promise<IAccount> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);
    if (!account) {
      throw new AppError('Conta não encontrada', 404);
    }
    return account;
  }

  /**
   * Obtém todas as contas de um usuário
   */
  async getUserAccounts(userId: string): Promise<IAccount[]> {
    return this.accountRepository.findByUserId(userId);
  }

  /**
   * Cria uma nova conta
   */
  async createAccount(accountData: Partial<IAccount>): Promise<IAccount> {
    // Gerar número de conta se não fornecido
    if (!accountData.accountNumber) {
      // Nota: Na implementação real, usaríamos o método estático do modelo
      // Aqui estamos simulando a geração de um número de conta
      const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
      accountData.accountNumber = randomNum.toString();
    }

    // Definir tipo padrão se não fornecido
    if (!accountData.type) {
      accountData.type = AccountType.CHECKING;
    }

    // Definir saldo inicial como 0 se não fornecido
    if (accountData.balance === undefined) {
      accountData.balance = 0;
    }

    // Criar a conta
    return this.accountRepository.create(accountData);
  }

  /**
   * Atualiza uma conta existente
   */
  async updateAccount(id: string, accountData: Partial<IAccount>): Promise<IAccount> {
    // Verificar se a conta existe
    const existingAccount = await this.accountRepository.findById(id);
    if (!existingAccount) {
      throw new AppError('Conta não encontrada', 404);
    }

    // Não permitir alteração do número da conta
    if (accountData.accountNumber && accountData.accountNumber !== existingAccount.accountNumber) {
      throw new AppError('Não é permitido alterar o número da conta', 400);
    }

    // Não permitir alteração do usuário associado
    if (accountData.user && accountData.user.toString() !== existingAccount.user.toString()) {
      throw new AppError('Não é permitido alterar o usuário associado à conta', 400);
    }

    // Atualizar a conta
    const updatedAccount = await this.accountRepository.update(id, accountData);
    if (!updatedAccount) {
      throw new AppError('Erro ao atualizar conta', 500);
    }

    return updatedAccount;
  }

  /**
   * Desativa uma conta
   */
  async deactivateAccount(id: string): Promise<IAccount> {
    // Verificar se a conta existe
    const existingAccount = await this.accountRepository.findById(id);
    if (!existingAccount) {
      throw new AppError('Conta não encontrada', 404);
    }

    // Verificar se a conta já está desativada
    if (!existingAccount.isActive) {
      throw new AppError('Conta já está desativada', 400);
    }

    // Desativar a conta
    const updatedAccount = await this.accountRepository.update(id, { isActive: false });
    if (!updatedAccount) {
      throw new AppError('Erro ao desativar conta', 500);
    }

    return updatedAccount;
  }

  /**
   * Remove uma conta
   */
  async deleteAccount(id: string): Promise<boolean> {
    // Verificar se a conta existe
    const existingAccount = await this.accountRepository.findById(id);
    if (!existingAccount) {
      throw new AppError('Conta não encontrada', 404);
    }

    // Verificar se a conta tem saldo
    if (existingAccount.balance > 0) {
      throw new AppError('Não é possível remover uma conta com saldo', 400);
    }

    // Remover a conta
    const result = await this.accountRepository.delete(id);
    if (!result) {
      throw new AppError('Erro ao remover conta', 500);
    }

    return true;
  }
}
