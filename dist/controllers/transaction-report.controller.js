"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionReportController = void 0;
const services_1 = require("../services");
const transaction_utils_1 = require("../utils/transaction.utils");
/**
 * Controlador para relatórios de transações
 */
class TransactionReportController {
    /**
     * Gera um recibo para uma transação
     */
    static async generateReceipt(req, res, next) {
        try {
            const { id } = req.params;
            // Buscar a transação
            const transaction = await services_1.transactionService.getTransactionById(id);
            // Gerar o recibo
            const receipt = services_1.transactionReportService.generateTransactionReceipt(transaction);
            res.status(200).json({
                status: 'success',
                data: {
                    receipt,
                    transaction
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Obtém um resumo das transações de uma conta
     */
    static async getTransactionSummary(req, res, next) {
        try {
            const { accountId } = req.params;
            const { startDate, endDate } = req.query;
            // Converter datas se fornecidas
            const parsedStartDate = startDate ? new Date(startDate) : undefined;
            const parsedEndDate = endDate ? new Date(endDate) : undefined;
            // Obter o resumo
            const summary = await services_1.transactionReportService.getTransactionSummary(accountId, parsedStartDate, parsedEndDate);
            res.status(200).json({
                status: 'success',
                data: {
                    summary
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Calcula o saldo de uma conta em um período
     */
    static async calculateAccountBalance(req, res, next) {
        try {
            const { accountId } = req.params;
            const { startDate, endDate } = req.query;
            // Converter datas se fornecidas
            const parsedStartDate = startDate ? new Date(startDate) : undefined;
            const parsedEndDate = endDate ? new Date(endDate) : undefined;
            // Calcular o saldo
            const balance = await services_1.transactionReportService.calculateAccountBalance(accountId, parsedStartDate, parsedEndDate);
            // Formatar o saldo
            const formattedBalance = transaction_utils_1.TransactionUtils.formatCurrency(balance);
            res.status(200).json({
                status: 'success',
                data: {
                    accountId,
                    balance,
                    formattedBalance,
                    period: {
                        startDate: parsedStartDate,
                        endDate: parsedEndDate
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionReportController = TransactionReportController;
//# sourceMappingURL=transaction-report.controller.js.map