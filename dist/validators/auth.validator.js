"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validadores para autenticação
 */
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 100 })
        .withMessage('Nome deve ter entre 3 e 100 caracteres'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email é obrigatório')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/\d/)
        .withMessage('Senha deve conter pelo menos um número')
        .matches(/[a-zA-Z]/)
        .withMessage('Senha deve conter pelo menos uma letra'),
    (0, express_validator_1.body)('cpf')
        .notEmpty()
        .withMessage('CPF é obrigatório')
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
 * Validadores para login
 */
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email é obrigatório')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
];
//# sourceMappingURL=auth.validator.js.map