import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

/**
 * Validadores para autenticação
 */
export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter pelo menos 8 caracteres')
    .matches(/\d/)
    .withMessage('Senha deve conter pelo menos um número')
    .matches(/[a-zA-Z]/)
    .withMessage('Senha deve conter pelo menos uma letra'),
  
  body('cpf')
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .matches(/^\d{11}$/)
    .withMessage('CPF deve conter 11 dígitos numéricos'),
  
  body('phone')
    .optional()
    .matches(/^\d{10,11}$/)
    .withMessage('Telefone deve conter entre 10 e 11 dígitos numéricos'),
  
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Endereço não pode ter mais de 200 caracteres')
];

/**
 * Validadores para login
 */
export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];
