import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../models';

/**
 * Middleware para verificar o token JWT
 * Usado para testar a autenticação
 */
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verificar se o token existe no header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Acesso não autorizado. Token não fornecido.'
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    // Verificar se o usuário existe
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Usuário não encontrado ou token inválido.'
      });
      return;
    }

    // Adicionar o usuário à requisição
    req.user = user;
    
    // Continuar para o próximo middleware
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado.'
    });
  }
};
