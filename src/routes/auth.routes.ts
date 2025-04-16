import { registerValidation, loginValidation } from '../validators/auth.validator';
import { Router } from 'express';
import { AuthController } from '../controllers';
import { validate } from '../middlewares';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário
 * @access  Público
 */
router.post(
  '/register',
  registerValidation,
  validate,
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica um usuário existente
 * @access  Público
 */
router.post(
  '/login',
  loginValidation,
  validate,
  AuthController.login
);

export default router;
