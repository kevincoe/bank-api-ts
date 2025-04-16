import { Request, Response, NextFunction } from 'express';
import { transactionService, transactionReportService } from '../services';
import { TransactionUtils } from '../utils/transaction.utils';

/**
 * Controlador para relatórios de transações
 */
export class TransactionReportController {
  /**
   * Gera um recibo para uma transação
   */
  static async generateReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar a transação
      const transaction = await transactionService.getTransactionById(id);
      
      // Gerar o recibo
      const receipt = transactionReportService.generateTransactionReceipt(transaction);

      res.status(200).json({
        status: 'success',
        data: {
          receipt,
          transaction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém um resumo das transações de uma conta
   */
  static async getTransactionSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accountId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Converter datas se fornecidas
      const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
      const parsedEndDate = endDate ? new Date(endDate as string) : undefined;
      
      // Obter o resumo
      const summary = await transactionReportService.getTransactionSummary(
        accountId,
        parsedStartDate,
        parsedEndDate
      );

      res.status(200).json({
        status: 'success',
        data: {
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calcula o saldo de uma conta em um período
   */
  static async calculateAccountBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accountId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Converter datas se fornecidas
      const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
      const parsedEndDate = endDate ? new Date(endDate as string) : undefined;
      
      // Calcular o saldo
      const balance = await transactionReportService.calculateAccountBalance(
        accountId,
        parsedStartDate,
        parsedEndDate
      );

      // Formatar o saldo
      const formattedBalance = TransactionUtils.formatCurrency(balance);

      res.status(200).json({
        status: 'success',
        data: {
          accountId,
          balance,
          formattedBalance,
          period: {
            startDate: parsedStartDate,
            endDate: parsedEndDate
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
