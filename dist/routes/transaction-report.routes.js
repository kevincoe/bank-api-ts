"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_report_controller_1 = require("../controllers/transaction-report.controller");
const middlewares_1 = require("../middlewares");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(middlewares_1.authenticate);
/**
 * @route   GET /api/reports/transactions/:id/receipt
 * @desc    Gera um recibo para uma transação
 * @access  Autenticado
 */
router.get('/transactions/:id/receipt', [
    (0, express_validator_1.param)('id').isMongoId().withMessage('ID de transação inválido'),
    middlewares_1.validate
], transaction_report_controller_1.TransactionReportController.generateReceipt);
/**
 * @route   GET /api/reports/accounts/:accountId/summary
 * @desc    Obtém um resumo das transações de uma conta
 * @access  Autenticado
 */
router.get('/accounts/:accountId/summary', [
    (0, express_validator_1.param)('accountId').isMongoId().withMessage('ID de conta inválido'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('Data final inválida'),
    middlewares_1.validate
], transaction_report_controller_1.TransactionReportController.getTransactionSummary);
/**
 * @route   GET /api/reports/accounts/:accountId/balance
 * @desc    Calcula o saldo de uma conta em um período
 * @access  Autenticado
 */
router.get('/accounts/:accountId/balance', [
    (0, express_validator_1.param)('accountId').isMongoId().withMessage('ID de conta inválido'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('Data final inválida'),
    middlewares_1.validate
], transaction_report_controller_1.TransactionReportController.calculateAccountBalance);
exports.default = router;
//# sourceMappingURL=transaction-report.routes.js.map