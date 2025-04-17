"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
/**
 * Middleware para autenticação
 * Todas as rotas abaixo requerem autenticação
 */
router.use(middlewares_1.authenticate);
/**
 * @route   GET /api/users
 * @desc    Obtém todos os usuários
 * @access  Admin
 */
router.get('/', (0, middlewares_1.authorize)('admin'), controllers_1.UserController.getAllUsers);
/**
 * @route   GET /api/users/:id
 * @desc    Obtém um usuário pelo ID
 * @access  Admin ou próprio usuário
 */
router.get('/:id', user_validator_1.getUserByIdValidation, middlewares_1.validate, controllers_1.UserController.getUserById);
/**
 * @route   PATCH /api/users/:id
 * @desc    Atualiza um usuário existente
 * @access  Admin ou próprio usuário
 */
router.patch('/:id', user_validator_1.updateUserValidation, middlewares_1.validate, controllers_1.UserController.updateUser);
/**
 * @route   DELETE /api/users/:id
 * @desc    Remove um usuário
 * @access  Admin ou próprio usuário
 */
router.delete('/:id', user_validator_1.deleteUserValidation, middlewares_1.validate, controllers_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map