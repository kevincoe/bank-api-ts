import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { AppError } from '../utils/error.utils';

/**
 * Controlador para autenticação
 */
export class AuthController {
  /**
   * Registra um novo usuário
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, cpf, phone, address } = req.body;
      
      const result = await authService.register({
        name,
        email,
        password,
        cpf,
        phone,
        address,
        role: 'client' // Por padrão, novos usuários são clientes
      });

      // Remover a senha do objeto de resposta
      const user = result.user.toObject();
      delete user.password;

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Autentica um usuário existente
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new AppError('Email e senha são obrigatórios', 400);
      }

      const result = await authService.login(email, password);

      // Remover a senha do objeto de resposta
      const user = result.user.toObject();
      delete user.password;

      res.status(200).json({
        status: 'success',
        data: {
          user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
