"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelTransactionValidation = exports.getAccountTransactionsValidation = exports.getTransactionByIdValidation = exports.transferValidation = exports.withdrawValidation = exports.depositValidation = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validadores para operações de transações
 */
/**
 * Validação para depósito
 */
exports.depositValidation = [
    (0, express_validator_1.body)('destinationAccountId')
        .isMongoId()
        .withMessage('ID de conta de destino inválido'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Valor deve ser um número')
        .isFloat({ min: 0.01 })
        .withMessage('Valor deve ser maior que zero'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Descrição deve ser uma string')
        .isLength({ max: 200 })
        .withMessage('Descrição não pode ter mais de 200 caracteres')
];
/**
 * Validação para saque
 */
exports.withdrawValidation = [
    (0, express_validator_1.body)('sourceAccountId')
        .isMongoId()
        .withMessage('ID de conta de origem inválido'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Valor deve ser um número')
        .isFloat({ min: 0.01 })
        .withMessage('Valor deve ser maior que zero'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Descrição deve ser uma string')
        .isLength({ max: 200 })
        .withMessage('Descrição não pode ter mais de 200 caracteres')
];
/**
 * Validação para transferência
 */
exports.transferValidation = [
    (0, express_validator_1.body)('sourceAccountId')
        .isMongoId()
        .withMessage('ID de conta de origem inválido'),
    (0, express_validator_1.body)('destinationAccountId')
        .isMongoId()
        .withMessage('ID de conta de destino inválido'),
    (0, express_validator_1.body)('amount')
        .isNumeric()
        .withMessage('Valor deve ser um número')
        .isFloat({ min: 0.01 })
        .withMessage('Valor deve ser maior que zero'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('Descrição deve ser uma string')
        .isLength({ max: 200 })
        .withMessage('Descrição não pode ter mais de 200 caracteres')
];
/**
 * Validação para busca de transação por ID
 */
exports.getTransactionByIdValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de transação inválido')
];
/**
 * Validação para busca de transações por conta
 */
exports.getAccountTransactionsValidation = [
    (0, express_validator_1.param)('accountId')
        .isMongoId()
        .withMessage('ID de conta inválido')
];
/**
 * Validação para cancelamento de transação
 */
exports.cancelTransactionValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de transação inválido')
];
//# sourceMappingURL=transaction.validator.js.map