import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { AppError } from '../utils/error.utils';

/**
 * Classe utilitária para transações
 */
export class TransactionUtils {
  /**
   * Verifica se o usuário tem permissão para acessar a conta
   */
  static async checkAccountAccess(
    userId: string,
    accountId: string,
    accountRepository: any
  ): Promise<boolean> {
    const account = await accountRepository.findById(accountId);
    if (!account) {
      throw new AppError('Conta não encontrada', 404);
    }

    // Administradores têm acesso a todas as contas
    if (userId && account.user.toString() !== userId) {
      throw new AppError('Você não tem permissão para acessar esta conta', 403);
    }

    return true;
  }

  /**
   * Formata o valor monetário para exibição
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  /**
   * Gera um número de referência para a transação
   */
  static generateReferenceNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TRX${timestamp}${random}`;
  }
}
