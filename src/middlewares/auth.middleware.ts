import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from './error.utils';
import { User, IUser } from '../models';

/**
 * Interface para o payload do token JWT
 */
interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware para verificar se o usuário está autenticado
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar se o token existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Acesso não autorizado. Token não fornecido.', 401);
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // Verificar se o usuário ainda existe
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('O usuário associado a este token não existe mais.', 401);
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Token inválido ou expirado.', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware para verificar permissões de usuário
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Acesso não autorizado. Faça login primeiro.', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Você não tem permissão para acessar este recurso.', 403));
      return;
    }

    next();
  };
};

// Estender o tipo Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
