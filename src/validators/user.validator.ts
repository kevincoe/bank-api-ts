import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';

/**
 * Validadores para operações de usuários
 */

/**
 * Validação para atualização de usuário
 */
export const updateUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuário inválido'),
  
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('cpf')
    .optional()
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
 * Validação para busca de usuário por ID
 */
export const getUserByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuário inválido')
];

/**
 * Validação para exclusão de usuário
 */
export const deleteUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuário inválido')
];
