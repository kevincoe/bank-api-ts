"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
/**
 * Implementação do repositório de contas
 */
class AccountRepository {
    constructor(Account) {
        this.Account = Account;
    }
    /**
     * Encontra todas as contas
     */
    async findAll() {
        return this.Account.find().populate('user', 'name email');
    }
    /**
     * Encontra uma conta pelo ID
     */
    async findById(id) {
        return this.Account.findById(id).populate('user', 'name email');
    }
    /**
     * Encontra uma conta pelo número
     */
    async findByAccountNumber(accountNumber) {
        return this.Account.findOne({ accountNumber }).populate('user', 'name email');
    }
    /**
     * Encontra todas as contas de um usuário
     */
    async findByUserId(userId) {
        return this.Account.find({ user: userId });
    }
    /**
     * Cria uma nova conta
     */
    async create(accountData) {
        return this.Account.create(accountData);
    }
    /**
     * Atualiza uma conta existente
     */
    async update(id, accountData) {
        return this.Account.findByIdAndUpdate(id, accountData, { new: true, runValidators: true }).populate('user', 'name email');
    }
    /**
     * Atualiza o saldo de uma conta
     */
    async updateBalance(id, amount) {
        const account = await this.Account.findById(id);
        if (!account)
            return null;
        account.balance += amount;
        await account.save();
        return account;
    }
    /**
     * Remove uma conta
     */
    async delete(id) {
        const result = await this.Account.findByIdAndDelete(id);
        return !!result;
    }
}
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map