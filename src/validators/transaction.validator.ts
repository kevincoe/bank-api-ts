import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { TransactionType } from '../models';

/**
 * Validadores para operações de transações
 */

/**
 * Validação para depósito
 */
export const depositValidation = [
  body('destinationAccountId')
    .isMongoId()
    .withMessage('ID de conta de destino inválido'),
  
  body('amount')
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string')
    .isLength({ max: 200 })
    .withMessage('Descrição não pode ter mais de 200 caracteres')
];

/**
 * Validação para saque
 */
export const withdrawValidation = [
  body('sourceAccountId')
    .isMongoId()
    .withMessage('ID de conta de origem inválido'),
  
  body('amount')
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string')
    .isLength({ max: 200 })
    .withMessage('Descrição não pode ter mais de 200 caracteres')
];

/**
 * Validação para transferência
 */
export const transferValidation = [
  body('sourceAccountId')
    .isMongoId()
    .withMessage('ID de conta de origem inválido'),
  
  body('destinationAccountId')
    .isMongoId()
    .withMessage('ID de conta de destino inválido'),
  
  body('amount')
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Descrição deve ser uma string')
    .isLength({ max: 200 })
    .withMessage('Descrição não pode ter mais de 200 caracteres')
];

/**
 * Validação para busca de transação por ID
 */
export const getTransactionByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de transação inválido')
];

/**
 * Validação para busca de transações por conta
 */
export const getAccountTransactionsValidation = [
  param('accountId')
    .isMongoId()
    .withMessage('ID de conta inválido')
];

/**
 * Validação para cancelamento de transação
 */
export const cancelTransactionValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de transação inválido')
];
