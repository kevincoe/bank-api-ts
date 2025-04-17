"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_token_middleware_1 = require("../middlewares/verify-token.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/auth/me
 * @desc    Obtém o perfil do usuário autenticado
 * @access  Privado
 */
router.get('/me', verify_token_middleware_1.verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
});
exports.default = router;
//# sourceMappingURL=profile.routes.js.map