import { ITransaction } from '../models/transaction.model';
import { TransactionUtils } from '../utils/transaction.utils';

/**
 * Interface para o serviço de relatórios de transações
 */
export interface ITransactionReportService {
  generateTransactionReceipt(transaction: ITransaction): string;
  calculateAccountBalance(accountId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getTransactionSummary(accountId: string, startDate?: Date, endDate?: Date): Promise<any>;
}

/**
 * Implementação do serviço de relatórios de transações
 */
export class TransactionReportService implements ITransactionReportService {
  constructor(
    private transactionRepository: any,
    private accountRepository: any
  ) {}

  /**
   * Gera um recibo para uma transação
   */
  generateTransactionReceipt(transaction: ITransaction): string {
    const referenceNumber = TransactionUtils.generateReferenceNumber();
    const formattedAmount = TransactionUtils.formatCurrency(transaction.amount);
    const timestamp = new Date(transaction.createdAt).toLocaleString('pt-BR');
    
    let receipt = `
=================================================
            COMPROVANTE DE TRANSAÇÃO
=================================================
Referência: ${referenceNumber}
Data/Hora: ${timestamp}
Tipo: ${this.getTransactionTypeText(transaction.type)}
Valor: ${formattedAmount}
Status: ${this.getTransactionStatusText(transaction.status)}
`;

    if (transaction.sourceAccount) {
      receipt += `Conta de Origem: ${transaction.sourceAccount}\n`;
    }
    
    if (transaction.destinationAccount) {
      receipt += `Conta de Destino: ${transaction.destinationAccount}\n`;
    }
    
    if (transaction.description) {
      receipt += `Descrição: ${transaction.description}\n`;
    }
    
    receipt += `=================================================
`;

    return receipt;
  }

  /**
   * Calcula o saldo de uma conta em um período
   */
  async calculateAccountBalance(accountId: string, startDate?: Date, endDate?: Date): Promise<number> {
    // Verificar se a conta existe
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    // Se não houver datas, retornar o saldo atual
    if (!startDate && !endDate) {
      return account.balance;
    }

    // Buscar todas as transações da conta no período
    const transactions = await this.transactionRepository.findByAccountId(accountId);
    
    // Filtrar por data se necessário
    const filteredTransactions = transactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.createdAt);
      
      if (startDate && transactionDate < startDate) {
        return false;
      }
      
      if (endDate && transactionDate > endDate) {
        return false;
      }
      
      return true;
    });

    // Calcular o saldo
    let balance = 0;
    
    filteredTransactions.forEach((transaction: any) => {
      if (transaction.status !== 'completed') {
        return;
      }
      
      if (transaction.type === 'deposit' && transaction.destinationAccount.toString() === accountId) {
        balance += transaction.amount;
      } else if (transaction.type === 'withdrawal' && transaction.sourceAccount.toString() === accountId) {
        balance -= transaction.amount;
      } else if (transaction.type === 'transfer') {
        if (transaction.sourceAccount.toString() === accountId) {
          balance -= transaction.amount;
        }
        if (transaction.destinationAccount.toString() === accountId) {
          balance += transaction.amount;
        }
      }
    });

    return balance;
  }

  /**
   * Obtém um resumo das transações de uma conta
   */
  async getTransactionSummary(accountId: string, startDate?: Date, endDate?: Date): Promise<any> {
    // Verificar se a conta existe
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    // Buscar todas as transações da conta
    const transactions = await this.transactionRepository.findByAccountId(accountId);
    
    // Filtrar por data se necessário
    const filteredTransactions = transactions.filter((transaction: ITransaction) => {
      const transactionDate = new Date(transaction.createdAt);
      
      if (startDate && transactionDate < startDate) {
        return false;
      }
      
      if (endDate && transactionDate > endDate) {
        return false;
      }
      
      return transaction.status === 'completed';
    });

    // Inicializar contadores
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTransfersIn = 0;
    let totalTransfersOut = 0;
    let countDeposits = 0;
    let countWithdrawals = 0;
    let countTransfersIn = 0;
    let countTransfersOut = 0;

    // Calcular totais
    filteredTransactions.forEach((transaction: ITransaction) => {
      if (transaction.type === 'deposit' && transaction.destinationAccount?.toString() === accountId) {
        totalDeposits += transaction.amount;
        countDeposits++;
      } else if (transaction.type === 'withdrawal' && transaction.sourceAccount?.toString() === accountId) {
        totalWithdrawals += transaction.amount;
        countWithdrawals++;
      } else if (transaction.type === 'transfer') {
        if (transaction.sourceAccount?.toString() === accountId) {
          totalTransfersOut += transaction.amount;
          countTransfersOut++;
        }
        if (transaction.destinationAccount?.toString() === accountId) {
          totalTransfersIn += transaction.amount;
          countTransfersIn++;
        }
      }
    });

    // Calcular saldo final
    const balance = await this.calculateAccountBalance(accountId, startDate, endDate);

    return {
      accountNumber: account.accountNumber,
      accountType: account.type,
      period: {
        startDate: startDate || new Date(account.createdAt),
        endDate: endDate || new Date()
      },
      transactions: {
        total: filteredTransactions.length,
        deposits: {
          count: countDeposits,
          total: totalDeposits
        },
        withdrawals: {
          count: countWithdrawals,
          total: totalWithdrawals
        },
        transfers: {
          incoming: {
            count: countTransfersIn,
            total: totalTransfersIn
          },
          outgoing: {
            count: countTransfersOut,
            total: totalTransfersOut
          }
        }
      },
      balance: balance
    };
  }

  /**
   * Obtém o texto do tipo de transação
   */
  private getTransactionTypeText(type: string): string {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Saque';
      case 'transfer':
        return 'Transferência';
      default:
        return type;
    }
  }

  /**
   * Obtém o texto do status da transação
   */
  private getTransactionStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluída';
      case 'failed':
        return 'Falha';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }
}
