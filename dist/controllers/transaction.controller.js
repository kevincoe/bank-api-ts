"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const services_1 = require("../services");
/**
 * Controlador para transações
 */
class TransactionController {
    /**
     * Obtém todas as transações
     */
    static async getAllTransactions(req, res, next) {
        try {
            const transactions = await services_1.transactionService.getAllTransactions();
            res.status(200).json({
                status: 'success',
                results: transactions.length,
                data: {
                    transactions
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém uma transação pelo ID
     */
    static async getTransactionById(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await services_1.transactionService.getTransactionById(id);
            res.status(200).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém todas as transações de uma conta
     */
    static async getAccountTransactions(req, res, next) {
        try {
            const { accountId } = req.params;
            const transactions = await services_1.transactionService.getAccountTransactions(accountId);
            res.status(200).json({
                status: 'success',
                results: transactions.length,
                data: {
                    transactions
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Realiza um depósito em uma conta
     */
    static async deposit(req, res, next) {
        try {
            const { destinationAccountId, amount, description } = req.body;
            const transaction = await services_1.transactionService.deposit(destinationAccountId, amount, description);
            res.status(201).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Realiza um saque de uma conta
     */
    static async withdraw(req, res, next) {
        try {
            const { sourceAccountId, amount, description } = req.body;
            const transaction = await services_1.transactionService.withdraw(sourceAccountId, amount, description);
            res.status(201).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Realiza uma transferência entre contas
     */
    static async transfer(req, res, next) {
        try {
            const { sourceAccountId, destinationAccountId, amount, description } = req.body;
            const transaction = await services_1.transactionService.transfer(sourceAccountId, destinationAccountId, amount, description);
            res.status(201).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Cancela uma transação pendente
     */
    static async cancelTransaction(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await services_1.transactionService.cancelTransaction(id);
            res.status(200).json({
                status: 'success',
                data: {
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map