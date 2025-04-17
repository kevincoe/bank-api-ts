"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountValidation = exports.deactivateAccountValidation = exports.getUserAccountsValidation = exports.getAccountByNumberValidation = exports.getAccountByIdValidation = exports.updateAccountValidation = exports.createAccountValidation = void 0;
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
/**
 * Validadores para operações de contas
 */
/**
 * Validação para criação de conta
 */
exports.createAccountValidation = [
    (0, express_validator_1.body)('type')
        .isIn(Object.values(models_1.AccountType))
        .withMessage('Tipo de conta inválido. Deve ser checking, savings ou investment'),
    (0, express_validator_1.body)('user')
        .isMongoId()
        .withMessage('ID de usuário inválido'),
    (0, express_validator_1.body)('balance')
        .optional()
        .isNumeric()
        .withMessage('Saldo deve ser um número')
        .isFloat({ min: 0 })
        .withMessage('Saldo inicial não pode ser negativo')
];
/**
 * Validação para atualização de conta
 */
exports.updateAccountValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de conta inválido'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(Object.values(models_1.AccountType))
        .withMessage('Tipo de conta inválido. Deve ser checking, savings ou investment'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('Status de ativação deve ser um booleano')
];
/**
 * Validação para busca de conta por ID
 */
exports.getAccountByIdValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de conta inválido')
];
/**
 * Validação para busca de conta por número
 */
exports.getAccountByNumberValidation = [
    (0, express_validator_1.param)('accountNumber')
        .notEmpty()
        .withMessage('Número da conta é obrigatório')
];
/**
 * Validação para busca de contas por usuário
 */
exports.getUserAccountsValidation = [
    (0, express_validator_1.param)('userId')
        .isMongoId()
        .withMessage('ID de usuário inválido')
];
/**
 * Validação para desativação de conta
 */
exports.deactivateAccountValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de conta inválido')
];
/**
 * Validação para exclusão de conta
 */
exports.deleteAccountValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de conta inválido')
];
//# sourceMappingURL=account.validator.js.map