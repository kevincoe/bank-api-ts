import { Router } from 'express';
import { TransactionReportController } from '../controllers/transaction-report.controller';
import { authenticate, validate } from '../middlewares';
import { param, query } from 'express-validator';

const router = Router();

/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(authenticate);

/**
 * @route   GET /api/reports/transactions/:id/receipt
 * @desc    Gera um recibo para uma transação
 * @access  Autenticado
 */
router.get(
  '/transactions/:id/receipt',
  [
    param('id').isMongoId().withMessage('ID de transação inválido'),
    validate
  ],
  TransactionReportController.generateReceipt
);

/**
 * @route   GET /api/reports/accounts/:accountId/summary
 * @desc    Obtém um resumo das transações de uma conta
 * @access  Autenticado
 */
router.get(
  '/accounts/:accountId/summary',
  [
    param('accountId').isMongoId().withMessage('ID de conta inválido'),
    query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    query('endDate').optional().isISO8601().withMessage('Data final inválida'),
    validate
  ],
  TransactionReportController.getTransactionSummary
);

/**
 * @route   GET /api/reports/accounts/:accountId/balance
 * @desc    Calcula o saldo de uma conta em um período
 * @access  Autenticado
 */
router.get(
  '/accounts/:accountId/balance',
  [
    param('accountId').isMongoId().withMessage('ID de conta inválido'),
    query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
    query('endDate').optional().isISO8601().withMessage('Data final inválida'),
    validate
  ],
  TransactionReportController.calculateAccountBalance
);

export default router;
