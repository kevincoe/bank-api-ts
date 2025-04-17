"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const transaction_validator_1 = require("../validators/transaction.validator");
const router = (0, express_1.Router)();
/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(middlewares_1.authenticate);
/**
 * @route   GET /api/transactions
 * @desc    Obtém todas as transações
 * @access  Autenticado
 */
router.get('/', controllers_1.TransactionController.getAllTransactions);
/**
 * @route   GET /api/transactions/:id
 * @desc    Obtém uma transação pelo ID
 * @access  Autenticado
 */
router.get('/:id', transaction_validator_1.getTransactionByIdValidation, middlewares_1.validate, controllers_1.TransactionController.getTransactionById);
/**
 * @route   GET /api/transactions/account/:accountId
 * @desc    Obtém todas as transações de uma conta
 * @access  Autenticado
 */
router.get('/account/:accountId', transaction_validator_1.getAccountTransactionsValidation, middlewares_1.validate, controllers_1.TransactionController.getAccountTransactions);
/**
 * @route   POST /api/transactions/deposit
 * @desc    Realiza um depósito em uma conta
 * @access  Autenticado
 */
router.post('/deposit', transaction_validator_1.depositValidation, middlewares_1.validate, controllers_1.TransactionController.deposit);
/**
 * @route   POST /api/transactions/withdraw
 * @desc    Realiza um saque de uma conta
 * @access  Autenticado
 */
router.post('/withdraw', transaction_validator_1.withdrawValidation, middlewares_1.validate, controllers_1.TransactionController.withdraw);
/**
 * @route   POST /api/transactions/transfer
 * @desc    Realiza uma transferência entre contas
 * @access  Autenticado
 */
router.post('/transfer', transaction_validator_1.transferValidation, middlewares_1.validate, controllers_1.TransactionController.transfer);
/**
 * @route   PATCH /api/transactions/:id/cancel
 * @desc    Cancela uma transação pendente
 * @access  Autenticado
 */
router.patch('/:id/cancel', transaction_validator_1.cancelTransactionValidation, middlewares_1.validate, controllers_1.TransactionController.cancelTransaction);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map