import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticate, authorize, validate } from '../middlewares';
import { 
  updateUserValidation,
  getUserByIdValidation,
  deleteUserValidation
} from '../validators/user.validator';

const router = Router();

/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Obtém todos os usuários
 * @access  Admin
 */
router.get(
  '/',
  authorize('admin'),
  UserController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Obtém um usuário pelo ID
 * @access  Admin ou próprio usuário
 */
router.get(
  '/:id',
  getUserByIdValidation,
  validate,
  UserController.getUserById
);

/**
 * @route   PATCH /api/users/:id
 * @desc    Atualiza um usuário existente
 * @access  Admin ou próprio usuário
 */
router.patch(
  '/:id',
  updateUserValidation,
  validate,
  UserController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Remove um usuário
 * @access  Admin ou próprio usuário
 */
router.delete(
  '/:id',
  deleteUserValidation,
  validate,
  UserController.deleteUser
);

export default router;
