"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const account_validator_1 = require("../validators/account.validator");
const router = (0, express_1.Router)();
/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(middlewares_1.authenticate);
/**
 * @route   GET /api/accounts
 * @desc    Obtém todas as contas
 * @access  Admin
 */
router.get('/', (0, middlewares_1.authorize)('admin'), controllers_1.AccountController.getAllAccounts);
/**
 * @route   GET /api/accounts/:id
 * @desc    Obtém uma conta pelo ID
 * @access  Admin ou proprietário da conta
 */
router.get('/:id', account_validator_1.getAccountByIdValidation, middlewares_1.validate, controllers_1.AccountController.getAccountById);
/**
 * @route   GET /api/accounts/number/:accountNumber
 * @desc    Obtém uma conta pelo número
 * @access  Admin ou proprietário da conta
 */
router.get('/number/:accountNumber', account_validator_1.getAccountByNumberValidation, middlewares_1.validate, controllers_1.AccountController.getAccountByNumber);
/**
 * @route   GET /api/accounts/user/:userId
 * @desc    Obtém todas as contas de um usuário
 * @access  Admin ou proprietário das contas
 */
router.get('/user/:userId', account_validator_1.getUserAccountsValidation, middlewares_1.validate, controllers_1.AccountController.getUserAccounts);
/**
 * @route   POST /api/accounts
 * @desc    Cria uma nova conta
 * @access  Admin
 */
router.post('/', (0, middlewares_1.authorize)('admin'), account_validator_1.createAccountValidation, middlewares_1.validate, controllers_1.AccountController.createAccount);
/**
 * @route   PATCH /api/accounts/:id
 * @desc    Atualiza uma conta existente
 * @access  Admin
 */
router.patch('/:id', (0, middlewares_1.authorize)('admin'), account_validator_1.updateAccountValidation, middlewares_1.validate, controllers_1.AccountController.updateAccount);
/**
 * @route   PATCH /api/accounts/:id/deactivate
 * @desc    Desativa uma conta
 * @access  Admin
 */
router.patch('/:id/deactivate', (0, middlewares_1.authorize)('admin'), account_validator_1.deactivateAccountValidation, middlewares_1.validate, controllers_1.AccountController.deactivateAccount);
/**
 * @route   DELETE /api/accounts/:id
 * @desc    Remove uma conta
 * @access  Admin
 */
router.delete('/:id', (0, middlewares_1.authorize)('admin'), account_validator_1.deleteAccountValidation, middlewares_1.validate, controllers_1.AccountController.deleteAccount);
exports.default = router;
//# sourceMappingURL=account.routes.js.map