import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { AccountType } from '../models';

/**
 * Validadores para operações de contas
 */

/**
 * Validação para criação de conta
 */
export const createAccountValidation = [
  body('type')
    .isIn(Object.values(AccountType))
    .withMessage('Tipo de conta inválido. Deve ser checking, savings ou investment'),
  
  body('user')
    .isMongoId()
    .withMessage('ID de usuário inválido'),
  
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Saldo deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Saldo inicial não pode ser negativo')
];

/**
 * Validação para atualização de conta
 */
export const updateAccountValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de conta inválido'),
  
  body('type')
    .optional()
    .isIn(Object.values(AccountType))
    .withMessage('Tipo de conta inválido. Deve ser checking, savings ou investment'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Status de ativação deve ser um booleano')
];

/**
 * Validação para busca de conta por ID
 */
export const getAccountByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de conta inválido')
];

/**
 * Validação para busca de conta por número
 */
export const getAccountByNumberValidation = [
  param('accountNumber')
    .notEmpty()
    .withMessage('Número da conta é obrigatório')
];

/**
 * Validação para busca de contas por usuário
 */
export const getUserAccountsValidation = [
  param('userId')
    .isMongoId()
    .withMessage('ID de usuário inválido')
];

/**
 * Validação para desativação de conta
 */
export const deactivateAccountValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de conta inválido')
];

/**
 * Validação para exclusão de conta
 */
export const deleteAccountValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de conta inválido')
];
