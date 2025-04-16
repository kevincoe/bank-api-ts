import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';

/**
 * Controlador para usuários
 */
export class UserController {
  /**
   * Obtém todos os usuários
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém um usuário pelo ID
   */
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza um usuário existente
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, cpf, phone, address } = req.body;
      
      const updatedUser = await userService.updateUser(id, {
        name,
        email,
        cpf,
        phone,
        address
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove um usuário
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}
