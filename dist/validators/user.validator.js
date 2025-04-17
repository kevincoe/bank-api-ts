"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidation = exports.getUserByIdValidation = exports.updateUserValidation = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validadores para operações de usuários
 */
/**
 * Validação para atualização de usuário
 */
exports.updateUserValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de usuário inválido'),
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Nome deve ter entre 3 e 100 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('cpf')
        .optional()
        .matches(/^\d{11}$/)
        .withMessage('CPF deve conter 11 dígitos numéricos'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^\d{10,11}$/)
        .withMessage('Telefone deve conter entre 10 e 11 dígitos numéricos'),
    (0, express_validator_1.body)('address')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Endereço não pode ter mais de 200 caracteres')
];
/**
 * Validação para busca de usuário por ID
 */
exports.getUserByIdValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de usuário inválido')
];
/**
 * Validação para exclusão de usuário
 */
exports.deleteUserValidation = [
    (0, express_validator_1.param)('id')
        .isMongoId()
        .withMessage('ID de usuário inválido')
];
//# sourceMappingURL=user.validator.js.map