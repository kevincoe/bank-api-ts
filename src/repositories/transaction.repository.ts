import { ITransaction, TransactionStatus } from '../models/transaction.model';

/**
 * Interface para o repositório de transações
 */
export interface ITransactionRepository {
  findAll(): Promise<ITransaction[]>;
  findById(id: string): Promise<ITransaction | null>;
  findBySourceAccount(accountId: string): Promise<ITransaction[]>;
  findByDestinationAccount(accountId: string): Promise<ITransaction[]>;
  findByAccountId(accountId: string): Promise<ITransaction[]>;
  findByStatus(status: TransactionStatus): Promise<ITransaction[]>;
  create(transactionData: Partial<ITransaction>): Promise<ITransaction>;
  updateStatus(id: string, status: TransactionStatus): Promise<ITransaction | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Implementação do repositório de transações
 */
export class TransactionRepository implements ITransactionRepository {
  private Transaction: any;

  constructor(Transaction: any) {
    this.Transaction = Transaction;
  }

  /**
   * Encontra todas as transações
   */
  async findAll(): Promise<ITransaction[]> {
    return this.Transaction.find()
      .populate('sourceAccount', 'accountNumber')
      .populate('destinationAccount', 'accountNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Encontra uma transação pelo ID
   */
  async findById(id: string): Promise<ITransaction | null> {
    return this.Transaction.findById(id)
      .populate('sourceAccount', 'accountNumber')
      .populate('destinationAccount', 'accountNumber');
  }

  /**
   * Encontra transações pela conta de origem
   */
  async findBySourceAccount(accountId: string): Promise<ITransaction[]> {
    return this.Transaction.find({ sourceAccount: accountId })
      .populate('destinationAccount', 'accountNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Encontra transações pela conta de destino
   */
  async findByDestinationAccount(accountId: string): Promise<ITransaction[]> {
    return this.Transaction.find({ destinationAccount: accountId })
      .populate('sourceAccount', 'accountNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Encontra transações por conta (origem ou destino)
   */
  async findByAccountId(accountId: string): Promise<ITransaction[]> {
    return this.Transaction.find({
      $or: [
        { sourceAccount: accountId },
        { destinationAccount: accountId }
      ]
    })
      .populate('sourceAccount', 'accountNumber')
      .populate('destinationAccount', 'accountNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Encontra transações por status
   */
  async findByStatus(status: TransactionStatus): Promise<ITransaction[]> {
    return this.Transaction.find({ status })
      .populate('sourceAccount', 'accountNumber')
      .populate('destinationAccount', 'accountNumber')
      .sort({ createdAt: -1 });
  }

  /**
   * Cria uma nova transação
   */
  async create(transactionData: Partial<ITransaction>): Promise<ITransaction> {
    return this.Transaction.create(transactionData);
  }

  /**
   * Atualiza o status de uma transação
   */
  async updateStatus(id: string, status: TransactionStatus): Promise<ITransaction | null> {
    return this.Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('sourceAccount', 'accountNumber')
      .populate('destinationAccount', 'accountNumber');
  }

  /**
   * Remove uma transação
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.Transaction.findByIdAndDelete(id);
    return !!result;
  }
}
