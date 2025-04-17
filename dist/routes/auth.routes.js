"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_validator_1 = require("../validators/auth.validator");
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário
 * @access  Público
 */
router.post('/register', auth_validator_1.registerValidation, middlewares_1.validate, controllers_1.AuthController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Autentica um usuário existente
 * @access  Público
 */
router.post('/login', auth_validator_1.loginValidation, middlewares_1.validate, controllers_1.AuthController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map