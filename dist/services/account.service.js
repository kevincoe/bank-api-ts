"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const error_utils_1 = require("../utils/error.utils");
const account_model_1 = require("../models/account.model");
/**
 * Implementação do serviço de contas
 */
class AccountService {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    /**
     * Obtém todas as contas
     */
    async getAllAccounts() {
        return this.accountRepository.findAll();
    }
    /**
     * Obtém uma conta pelo ID
     */
    async getAccountById(id) {
        const account = await this.accountRepository.findById(id);
        if (!account) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        return account;
    }
    /**
     * Obtém uma conta pelo número
     */
    async getAccountByNumber(accountNumber) {
        const account = await this.accountRepository.findByAccountNumber(accountNumber);
        if (!account) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        return account;
    }
    /**
     * Obtém todas as contas de um usuário
     */
    async getUserAccounts(userId) {
        return this.accountRepository.findByUserId(userId);
    }
    /**
     * Cria uma nova conta
     */
    async createAccount(accountData) {
        // Gerar número de conta se não fornecido
        if (!accountData.accountNumber) {
            // Nota: Na implementação real, usaríamos o método estático do modelo
            // Aqui estamos simulando a geração de um número de conta
            const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
            accountData.accountNumber = randomNum.toString();
        }
        // Definir tipo padrão se não fornecido
        if (!accountData.type) {
            accountData.type = account_model_1.AccountType.CHECKING;
        }
        // Definir saldo inicial como 0 se não fornecido
        if (accountData.balance === undefined) {
            accountData.balance = 0;
        }
        // Criar a conta
        return this.accountRepository.create(accountData);
    }
    /**
     * Atualiza uma conta existente
     */
    async updateAccount(id, accountData) {
        // Verificar se a conta existe
        const existingAccount = await this.accountRepository.findById(id);
        if (!existingAccount) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        // Não permitir alteração do número da conta
        if (accountData.accountNumber && accountData.accountNumber !== existingAccount.accountNumber) {
            throw new error_utils_1.AppError('Não é permitido alterar o número da conta', 400);
        }
        // Não permitir alteração do usuário associado
        if (accountData.user && accountData.user.toString() !== existingAccount.user.toString()) {
            throw new error_utils_1.AppError('Não é permitido alterar o usuário associado à conta', 400);
        }
        // Atualizar a conta
        const updatedAccount = await this.accountRepository.update(id, accountData);
        if (!updatedAccount) {
            throw new error_utils_1.AppError('Erro ao atualizar conta', 500);
        }
        return updatedAccount;
    }
    /**
     * Desativa uma conta
     */
    async deactivateAccount(id) {
        // Verificar se a conta existe
        const existingAccount = await this.accountRepository.findById(id);
        if (!existingAccount) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        // Verificar se a conta já está desativada
        if (!existingAccount.isActive) {
            throw new error_utils_1.AppError('Conta já está desativada', 400);
        }
        // Desativar a conta
        const updatedAccount = await this.accountRepository.update(id, { isActive: false });
        if (!updatedAccount) {
            throw new error_utils_1.AppError('Erro ao desativar conta', 500);
        }
        return updatedAccount;
    }
    /**
     * Remove uma conta
     */
    async deleteAccount(id) {
        // Verificar se a conta existe
        const existingAccount = await this.accountRepository.findById(id);
        if (!existingAccount) {
            throw new error_utils_1.AppError('Conta não encontrada', 404);
        }
        // Verificar se a conta tem saldo
        if (existingAccount.balance > 0) {
            throw new error_utils_1.AppError('Não é possível remover uma conta com saldo', 400);
        }
        // Remover a conta
        const result = await this.accountRepository.delete(id);
        if (!result) {
            throw new error_utils_1.AppError('Erro ao remover conta', 500);
        }
        return true;
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map