import { Request, Response, NextFunction } from 'express';
import { accountService } from '../services';

/**
 * Controlador para contas
 */
export class AccountController {
  /**
   * Obtém todas as contas
   */
  static async getAllAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accounts = await accountService.getAllAccounts();

      res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: {
          accounts
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém uma conta pelo ID
   */
  static async getAccountById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const account = await accountService.getAccountById(id);

      res.status(200).json({
        status: 'success',
        data: {
          account
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém uma conta pelo número
   */
  static async getAccountByNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accountNumber } = req.params;
      const account = await accountService.getAccountByNumber(accountNumber);

      res.status(200).json({
        status: 'success',
        data: {
          account
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém todas as contas de um usuário
   */
  static async getUserAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const accounts = await accountService.getUserAccounts(userId);

      res.status(200).json({
        status: 'success',
        results: accounts.length,
        data: {
          accounts
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria uma nova conta
   */
  static async createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, balance, user } = req.body;
      
      const newAccount = await accountService.createAccount({
        type,
        balance,
        user
      });

      res.status(201).json({
        status: 'success',
        data: {
          account: newAccount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma conta existente
   */
  static async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { type, isActive } = req.body;
      
      const updatedAccount = await accountService.updateAccount(id, {
        type,
        isActive
      });

      res.status(200).json({
        status: 'success',
        data: {
          account: updatedAccount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desativa uma conta
   */
  static async deactivateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deactivatedAccount = await accountService.deactivateAccount(id);

      res.status(200).json({
        status: 'success',
        data: {
          account: deactivatedAccount
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove uma conta
   */
  static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await accountService.deleteAccount(id);

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}
