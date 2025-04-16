import { Router } from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware';

const router = Router();

/**
 * @route   GET /api/auth/me
 * @desc    Obtém o perfil do usuário autenticado
 * @access  Privado
 */
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

export default router;
