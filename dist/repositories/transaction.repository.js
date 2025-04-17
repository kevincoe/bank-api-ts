"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
/**
 * Implementação do repositório de transações
 */
class TransactionRepository {
    constructor(Transaction) {
        this.Transaction = Transaction;
    }
    /**
     * Encontra todas as transações
     */
    async findAll() {
        return this.Transaction.find()
            .populate('sourceAccount', 'accountNumber')
            .populate('destinationAccount', 'accountNumber')
            .sort({ createdAt: -1 });
    }
    /**
     * Encontra uma transação pelo ID
     */
    async findById(id) {
        return this.Transaction.findById(id)
            .populate('sourceAccount', 'accountNumber')
            .populate('destinationAccount', 'accountNumber');
    }
    /**
     * Encontra transações pela conta de origem
     */
    async findBySourceAccount(accountId) {
        return this.Transaction.find({ sourceAccount: accountId })
            .populate('destinationAccount', 'accountNumber')
            .sort({ createdAt: -1 });
    }
    /**
     * Encontra transações pela conta de destino
     */
    async findByDestinationAccount(accountId) {
        return this.Transaction.find({ destinationAccount: accountId })
            .populate('sourceAccount', 'accountNumber')
            .sort({ createdAt: -1 });
    }
    /**
     * Encontra transações por conta (origem ou destino)
     */
    async findByAccountId(accountId) {
        return this.Transaction.find({
            $or: [
                { sourceAccount: accountId },
                { destinationAccount: accountId }
            ]
        })
            .populate('sourceAccount', 'accountNumber')
            .populate('destinationAccount', 'accountNumber')
            .sort({ createdAt: -1 });
    }
    /**
     * Encontra transações por status
     */
    async findByStatus(status) {
        return this.Transaction.find({ status })
            .populate('sourceAccount', 'accountNumber')
            .populate('destinationAccount', 'accountNumber')
            .sort({ createdAt: -1 });
    }
    /**
     * Cria uma nova transação
     */
    async create(transactionData) {
        return this.Transaction.create(transactionData);
    }
    /**
     * Atualiza o status de uma transação
     */
    async updateStatus(id, status) {
        return this.Transaction.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
            .populate('sourceAccount', 'accountNumber')
            .populate('destinationAccount', 'accountNumber');
    }
    /**
     * Remove uma transação
     */
    async delete(id) {
        const result = await this.Transaction.findByIdAndDelete(id);
        return !!result;
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map