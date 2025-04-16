import { IAccountRepository } from '../repositories/account.repository';
import { ITransactionRepository } from '../repositories/transaction.repository';
import { AppError } from '../utils/error.utils';
import { ITransaction, TransactionType, TransactionStatus } from '../models/transaction.model';

/**
 * Interface para o serviço de transações
 */
export interface ITransactionService {
  getAllTransactions(): Promise<ITransaction[]>;
  getTransactionById(id: string): Promise<ITransaction>;
  getAccountTransactions(accountId: string): Promise<ITransaction[]>;
  deposit(destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
  withdraw(sourceAccountId: string, amount: number, description?: string): Promise<ITransaction>;
  transfer(sourceAccountId: string, destinationAccountId: string, amount: number, description?: string): Promise<ITransaction>;
  cancelTransaction(id: string): Promise<ITransaction>;
}

/**
 * Implementação do serviço de transações
 */
export class TransactionService implements ITransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private accountRepository: IAccountRepository
  ) {}

  /**
   * Obtém todas as transações
   */
  async getAllTransactions(): Promise<ITransaction[]> {
    return this.transactionRepository.findAll();
  }

  /**
   * Obtém uma transação pelo ID
   */
  async getTransactionById(id: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new AppError('Transação não encontrada', 404);
    }
    return transaction;
  }

  /**
   * Obtém todas as transações de uma conta
   */
  async getAccountTransactions(accountId: string): Promise<ITransaction[]> {
    // Verificar se a conta existe
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AppError('Conta não encontrada', 404);
    }

    return this.transactionRepository.findByAccountId(accountId);
  }

  /**
   * Realiza um depósito em uma conta
   */
  async deposit(destinationAccountId: string, amount: number, description?: string): Promise<ITransaction> {
    // Validar valor
    if (amount <= 0) {
      throw new AppError('O valor do depósito deve ser maior que zero', 400);
    }

    // Verificar se a conta de destino existe
    const destinationAccount = await this.accountRepository.findById(destinationAccountId);
    if (!destinationAccount) {
      throw new AppError('Conta de destino não encontrada', 404);
    }

    // Verificar se a conta está ativa
    if (!destinationAccount.isActive) {
      throw new AppError('Conta de destino está inativa', 400);
    }

    // Criar a transação
    const transaction = await this.transactionRepository.create({
      type: TransactionType.DEPOSIT,
      amount,
      destinationAccount: destinationAccountId,
      description: description || 'Depósito',
      status: TransactionStatus.PENDING,
    });

    try {
      // Atualizar o saldo da conta
      await this.accountRepository.updateBalance(destinationAccountId, amount);

      // Atualizar o status da transação
      return this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.COMPLETED
      ) as Promise<ITransaction>;
    } catch (error) {
      // Em caso de erro, atualizar o status da transação
      await this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.FAILED
      );
      throw new AppError('Erro ao processar depósito', 500);
    }
  }

  /**
   * Realiza um saque de uma conta
   */
  async withdraw(sourceAccountId: string, amount: number, description?: string): Promise<ITransaction> {
    // Validar valor
    if (amount <= 0) {
      throw new AppError('O valor do saque deve ser maior que zero', 400);
    }

    // Verificar se a conta de origem existe
    const sourceAccount = await this.accountRepository.findById(sourceAccountId);
    if (!sourceAccount) {
      throw new AppError('Conta de origem não encontrada', 404);
    }

    // Verificar se a conta está ativa
    if (!sourceAccount.isActive) {
      throw new AppError('Conta de origem está inativa', 400);
    }

    // Verificar se há saldo suficiente
    if (sourceAccount.balance < amount) {
      throw new AppError('Saldo insuficiente', 400);
    }

    // Criar a transação
    const transaction = await this.transactionRepository.create({
      type: TransactionType.WITHDRAWAL,
      amount,
      sourceAccount: sourceAccountId,
      description: description || 'Saque',
      status: TransactionStatus.PENDING,
    });

    try {
      // Atualizar o saldo da conta
      await this.accountRepository.updateBalance(sourceAccountId, -amount);

      // Atualizar o status da transação
      return this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.COMPLETED
      ) as Promise<ITransaction>;
    } catch (error) {
      // Em caso de erro, atualizar o status da transação
      await this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.FAILED
      );
      throw new AppError('Erro ao processar saque', 500);
    }
  }

  /**
   * Realiza uma transferência entre contas
   */
  async transfer(
    sourceAccountId: string,
    destinationAccountId: string,
    amount: number,
    description?: string
  ): Promise<ITransaction> {
    // Validar valor
    if (amount <= 0) {
      throw new AppError('O valor da transferência deve ser maior que zero', 400);
    }

    // Verificar se as contas são diferentes
    if (sourceAccountId === destinationAccountId) {
      throw new AppError('As contas de origem e destino não podem ser iguais', 400);
    }

    // Verificar se a conta de origem existe
    const sourceAccount = await this.accountRepository.findById(sourceAccountId);
    if (!sourceAccount) {
      throw new AppError('Conta de origem não encontrada', 404);
    }

    // Verificar se a conta de destino existe
    const destinationAccount = await this.accountRepository.findById(destinationAccountId);
    if (!destinationAccount) {
      throw new AppError('Conta de destino não encontrada', 404);
    }

    // Verificar se as contas estão ativas
    if (!sourceAccount.isActive) {
      throw new AppError('Conta de origem está inativa', 400);
    }
    if (!destinationAccount.isActive) {
      throw new AppError('Conta de destino está inativa', 400);
    }

    // Verificar se há saldo suficiente
    if (sourceAccount.balance < amount) {
      throw new AppError('Saldo insuficiente', 400);
    }

    // Criar a transação
    const transaction = await this.transactionRepository.create({
      type: TransactionType.TRANSFER,
      amount,
      sourceAccount: sourceAccountId,
      destinationAccount: destinationAccountId,
      description: description || 'Transferência',
      status: TransactionStatus.PENDING,
    });

    try {
      // Atualizar o saldo das contas
      await this.accountRepository.updateBalance(sourceAccountId, -amount);
      await this.accountRepository.updateBalance(destinationAccountId, amount);

      // Atualizar o status da transação
      return this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.COMPLETED
      ) as Promise<ITransaction>;
    } catch (error) {
      // Em caso de erro, atualizar o status da transação
      await this.transactionRepository.updateStatus(
        transaction._id,
        TransactionStatus.FAILED
      );
      throw new AppError('Erro ao processar transferência', 500);
    }
  }

  /**
   * Cancela uma transação pendente
   */
  async cancelTransaction(id: string): Promise<ITransaction> {
    // Verificar se a transação existe
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new AppError('Transação não encontrada', 404);
    }

    // Verificar se a transação está pendente
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new AppError('Apenas transações pendentes podem ser canceladas', 400);
    }

    // Atualizar o status da transação
    return this.transactionRepository.updateStatus(
      id,
      TransactionStatus.CANCELLED
    ) as Promise<ITransaction>;
  }
}
