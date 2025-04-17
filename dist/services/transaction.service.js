"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_utils_1 = require("../utils/error.utils");
const transaction_model_1 = require("../models/transaction.model");
/**
 * Implementação do serviço de transações
 */
class TransactionService {
    constructor(transactionRepository, accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }
    /**
     * Obtém todas as transações
     */
    async getAllTransactions() {
        return this.transactionRepository.findAll();
    }
    /**
     * Obtém uma transação pelo ID
     */
    async getTransactionById(id) {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw new error_utils_1.AppError('Transação não encontrada', 404);
        }
        return transaction;
    }
    /**
     * Obtém todas as transações de uma conta
     */
    async getAccountTransactions(accountId) {
        // Verificar se a conta existe
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        return this.transactionRepository.findByAccountId(accountId);
    }
    /**
     * Realiza um depósito em uma conta
     */
    async deposit(destinationAccountId, amount, description) {
        // Validar valor
        if (amount <= 0) {
            throw new error_utils_1.AppError('O valor do depósito deve ser maior que zero', 400);
        }
        // Verificar se a conta de destino existe
        const destinationAccount = await this.accountRepository.findById(destinationAccountId);
        if (!destinationAccount) {
            throw new error_utils_1.AppError('Conta de destino não encontrada', 404);
        }
        // Verificar se a conta está ativa
        if (!destinationAccount.isActive) {
            throw new error_utils_1.AppError('Conta de destino está inativa', 400);
        }
        // Criar a transação
        const transaction = await this.transactionRepository.create({
            type: transaction_model_1.TransactionType.DEPOSIT,
            amount,
            destinationAccount: new mongoose_1.default.Types.ObjectId(destinationAccountId),
            description: description || 'Depósito',
            status: transaction_model_1.TransactionStatus.PENDING,
        });
        try {
            // Atualizar o saldo da conta
            await this.accountRepository.updateBalance(destinationAccountId, amount);
            // Atualizar o status da transação
            return this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.COMPLETED);
        }
        catch (error) {
            // Em caso de erro, atualizar o status da transação
            await this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.FAILED);
            throw new error_utils_1.AppError('Erro ao processar depósito', 500);
        }
    }
    /**
     * Realiza um saque de uma conta
     */
    async withdraw(sourceAccountId, amount, description) {
        // Validar valor
        if (amount <= 0) {
            throw new error_utils_1.AppError('O valor do saque deve ser maior que zero', 400);
        }
        // Verificar se a conta de origem existe
        const sourceAccount = await this.accountRepository.findById(sourceAccountId);
        if (!sourceAccount) {
            throw new error_utils_1.AppError('Conta de origem não encontrada', 404);
        }
        // Verificar se a conta está ativa
        if (!sourceAccount.isActive) {
            throw new error_utils_1.AppError('Conta de origem está inativa', 400);
        }
        // Verificar se há saldo suficiente
        if (sourceAccount.balance < amount) {
            throw new error_utils_1.AppError('Saldo insuficiente', 400);
        }
        // Criar a transação
        const transaction = await this.transactionRepository.create({
            type: transaction_model_1.TransactionType.WITHDRAWAL,
            amount,
            sourceAccount: new mongoose_1.default.Types.ObjectId(sourceAccountId),
            description: description || 'Saque',
            status: transaction_model_1.TransactionStatus.PENDING,
        });
        try {
            // Atualizar o saldo da conta
            await this.accountRepository.updateBalance(sourceAccountId, -amount);
            // Atualizar o status da transação
            return this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.COMPLETED);
        }
        catch (error) {
            // Em caso de erro, atualizar o status da transação
            await this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.FAILED);
            throw new error_utils_1.AppError('Erro ao processar saque', 500);
        }
    }
    /**
     * Realiza uma transferência entre contas
     */
    async transfer(sourceAccountId, destinationAccountId, amount, description) {
        // Validar valor
        if (amount <= 0) {
            throw new error_utils_1.AppError('O valor da transferência deve ser maior que zero', 400);
        }
        // Verificar se as contas são diferentes
        if (sourceAccountId === destinationAccountId) {
            throw new error_utils_1.AppError('As contas de origem e destino não podem ser iguais', 400);
        }
        // Verificar se a conta de origem existe
        const sourceAccount = await this.accountRepository.findById(sourceAccountId);
        if (!sourceAccount) {
            throw new error_utils_1.AppError('Conta de origem não encontrada', 404);
        }
        // Verificar se a conta de destino existe
        const destinationAccount = await this.accountRepository.findById(destinationAccountId);
        if (!destinationAccount) {
            throw new error_utils_1.AppError('Conta de destino não encontrada', 404);
        }
        // Verificar se as contas estão ativas
        if (!sourceAccount.isActive) {
            throw new error_utils_1.AppError('Conta de origem está inativa', 400);
        }
        if (!destinationAccount.isActive) {
            throw new error_utils_1.AppError('Conta de destino está inativa', 400);
        }
        // Verificar se há saldo suficiente
        if (sourceAccount.balance < amount) {
            throw new error_utils_1.AppError('Saldo insuficiente', 400);
        }
        // Criar a transação
        const transaction = await this.transactionRepository.create({
            type: transaction_model_1.TransactionType.TRANSFER,
            amount,
            sourceAccount: new mongoose_1.default.Types.ObjectId(sourceAccountId),
            destinationAccount: new mongoose_1.default.Types.ObjectId(destinationAccountId),
            description: description || 'Transferência',
            status: transaction_model_1.TransactionStatus.PENDING,
        });
        try {
            // Atualizar o saldo das contas
            await this.accountRepository.updateBalance(sourceAccountId, -amount);
            await this.accountRepository.updateBalance(destinationAccountId, amount);
            // Atualizar o status da transação
            return this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.COMPLETED);
        }
        catch (error) {
            // Em caso de erro, atualizar o status da transação
            await this.transactionRepository.updateStatus(transaction._id?.toString() || '', transaction_model_1.TransactionStatus.FAILED);
            throw new error_utils_1.AppError('Erro ao processar transferência', 500);
        }
    }
    /**
     * Cancela uma transação pendente
     */
    async cancelTransaction(id) {
        // Verificar se a transação existe
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw new error_utils_1.AppError('Transação não encontrada', 404);
        }
        // Verificar se a transação está pendente
        if (transaction.status !== transaction_model_1.TransactionStatus.PENDING) {
            throw new error_utils_1.AppError('Apenas transações pendentes podem ser canceladas', 400);
        }
        // Atualizar o status da transação
        return this.transactionRepository.updateStatus(id, transaction_model_1.TransactionStatus.CANCELLED);
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map