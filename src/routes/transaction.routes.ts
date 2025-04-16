import { Router } from 'express';
import { TransactionController } from '../controllers';
import { authenticate, validate } from '../middlewares';
import { 
  depositValidation,
  withdrawValidation,
  transferValidation,
  getTransactionByIdValidation,
  getAccountTransactionsValidation,
  cancelTransactionValidation
} from '../validators/transaction.validator';

const router = Router();

/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(authenticate);

/**
 * @route   GET /api/transactions
 * @desc    Obtém todas as transações
 * @access  Autenticado
 */
router.get(
  '/',
  TransactionController.getAllTransactions
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Obtém uma transação pelo ID
 * @access  Autenticado
 */
router.get(
  '/:id',
  getTransactionByIdValidation,
  validate,
  TransactionController.getTransactionById
);

/**
 * @route   GET /api/transactions/account/:accountId
 * @desc    Obtém todas as transações de uma conta
 * @access  Autenticado
 */
router.get(
  '/account/:accountId',
  getAccountTransactionsValidation,
  validate,
  TransactionController.getAccountTransactions
);

/**
 * @route   POST /api/transactions/deposit
 * @desc    Realiza um depósito em uma conta
 * @access  Autenticado
 */
router.post(
  '/deposit',
  depositValidation,
  validate,
  TransactionController.deposit
);

/**
 * @route   POST /api/transactions/withdraw
 * @desc    Realiza um saque de uma conta
 * @access  Autenticado
 */
router.post(
  '/withdraw',
  withdrawValidation,
  validate,
  TransactionController.withdraw
);

/**
 * @route   POST /api/transactions/transfer
 * @desc    Realiza uma transferência entre contas
 * @access  Autenticado
 */
router.post(
  '/transfer',
  transferValidation,
  validate,
  TransactionController.transfer
);

/**
 * @route   PATCH /api/transactions/:id/cancel
 * @desc    Cancela uma transação pendente
 * @access  Autenticado
 */
router.patch(
  '/:id/cancel',
  cancelTransactionValidation,
  validate,
  TransactionController.cancelTransaction
);

export default router;
