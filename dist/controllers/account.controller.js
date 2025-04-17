"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const services_1 = require("../services");
/**
 * Controlador para contas
 */
class AccountController {
    /**
     * Obtém todas as contas
     */
    static async getAllAccounts(req, res, next) {
        try {
            const accounts = await services_1.accountService.getAllAccounts();
            res.status(200).json({
                status: 'success',
                results: accounts.length,
                data: {
                    accounts
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém uma conta pelo ID
     */
    static async getAccountById(req, res, next) {
        try {
            const { id } = req.params;
            const account = await services_1.accountService.getAccountById(id);
            res.status(200).json({
                status: 'success',
                data: {
                    account
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém uma conta pelo número
     */
    static async getAccountByNumber(req, res, next) {
        try {
            const { accountNumber } = req.params;
            const account = await services_1.accountService.getAccountByNumber(accountNumber);
            res.status(200).json({
                status: 'success',
                data: {
                    account
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém todas as contas de um usuário
     */
    static async getUserAccounts(req, res, next) {
        try {
            const { userId } = req.params;
            const accounts = await services_1.accountService.getUserAccounts(userId);
            res.status(200).json({
                status: 'success',
                results: accounts.length,
                data: {
                    accounts
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Cria uma nova conta
     */
    static async createAccount(req, res, next) {
        try {
            const { type, balance, user } = req.body;
            const newAccount = await services_1.accountService.createAccount({
                type,
                balance,
                user
            });
            res.status(201).json({
                status: 'success',
                data: {
                    account: newAccount
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Atualiza uma conta existente
     */
    static async updateAccount(req, res, next) {
        try {
            const { id } = req.params;
            const { type, isActive } = req.body;
            const updatedAccount = await services_1.accountService.updateAccount(id, {
                type,
                isActive
            });
            res.status(200).json({
                status: 'success',
                data: {
                    account: updatedAccount
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Desativa uma conta
     */
    static async deactivateAccount(req, res, next) {
        try {
            const { id } = req.params;
            const deactivatedAccount = await services_1.accountService.deactivateAccount(id);
            res.status(200).json({
                status: 'success',
                data: {
                    account: deactivatedAccount
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove uma conta
     */
    static async deleteAccount(req, res, next) {
        try {
            const { id } = req.params;
            await services_1.accountService.deleteAccount(id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map