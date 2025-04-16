import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services';

/**
 * Controlador para transações
 */
export class TransactionController {
  /**
   * Obtém todas as transações
   */
  static async getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transactions = await transactionService.getAllTransactions();

      res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: {
          transactions
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém uma transação pelo ID
   */
  static async getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(id);

      res.status(200).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém todas as transações de uma conta
   */
  static async getAccountTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accountId } = req.params;
      const transactions = await transactionService.getAccountTransactions(accountId);

      res.status(200).json({
        status: 'success',
        results: transactions.length,
        data: {
          transactions
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Realiza um depósito em uma conta
   */
  static async deposit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { destinationAccountId, amount, description } = req.body;
      
      const transaction = await transactionService.deposit(
        destinationAccountId,
        amount,
        description
      );

      res.status(201).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Realiza um saque de uma conta
   */
  static async withdraw(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sourceAccountId, amount, description } = req.body;
      
      const transaction = await transactionService.withdraw(
        sourceAccountId,
        amount,
        description
      );

      res.status(201).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Realiza uma transferência entre contas
   */
  static async transfer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sourceAccountId, destinationAccountId, amount, description } = req.body;
      
      const transaction = await transactionService.transfer(
        sourceAccountId,
        destinationAccountId,
        amount,
        description
      );

      res.status(201).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancela uma transação pendente
   */
  static async cancelTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const transaction = await transactionService.cancelTransaction(id);

      res.status(200).json({
        status: 'success',
        data: {
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
