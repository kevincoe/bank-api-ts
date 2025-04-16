import { Router } from 'express';
import { AccountController } from '../controllers';
import { authenticate, authorize, validate } from '../middlewares';
import { 
  createAccountValidation,
  updateAccountValidation,
  getAccountByIdValidation,
  getAccountByNumberValidation,
  getUserAccountsValidation,
  deactivateAccountValidation,
  deleteAccountValidation
} from '../validators/account.validator';

const router = Router();

/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(authenticate);

/**
 * @route   GET /api/accounts
 * @desc    Obtém todas as contas
 * @access  Admin
 */
router.get(
  '/',
  authorize('admin'),
  AccountController.getAllAccounts
);

/**
 * @route   GET /api/accounts/:id
 * @desc    Obtém uma conta pelo ID
 * @access  Admin ou proprietário da conta
 */
router.get(
  '/:id',
  getAccountByIdValidation,
  validate,
  AccountController.getAccountById
);

/**
 * @route   GET /api/accounts/number/:accountNumber
 * @desc    Obtém uma conta pelo número
 * @access  Admin ou proprietário da conta
 */
router.get(
  '/number/:accountNumber',
  getAccountByNumberValidation,
  validate,
  AccountController.getAccountByNumber
);

/**
 * @route   GET /api/accounts/user/:userId
 * @desc    Obtém todas as contas de um usuário
 * @access  Admin ou proprietário das contas
 */
router.get(
  '/user/:userId',
  getUserAccountsValidation,
  validate,
  AccountController.getUserAccounts
);

/**
 * @route   POST /api/accounts
 * @desc    Cria uma nova conta
 * @access  Admin
 */
router.post(
  '/',
  authorize('admin'),
  createAccountValidation,
  validate,
  AccountController.createAccount
);

/**
 * @route   PATCH /api/accounts/:id
 * @desc    Atualiza uma conta existente
 * @access  Admin
 */
router.patch(
  '/:id',
  authorize('admin'),
  updateAccountValidation,
  validate,
  AccountController.updateAccount
);

/**
 * @route   PATCH /api/accounts/:id/deactivate
 * @desc    Desativa uma conta
 * @access  Admin
 */
router.patch(
  '/:id/deactivate',
  authorize('admin'),
  deactivateAccountValidation,
  validate,
  AccountController.deactivateAccount
);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Remove uma conta
 * @access  Admin
 */
router.delete(
  '/:id',
  authorize('admin'),
  deleteAccountValidation,
  validate,
  AccountController.deleteAccount
);

export default router;
