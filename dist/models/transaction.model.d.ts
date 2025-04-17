import mongoose, { Document } from 'mongoose';
/**
 * Enum para tipos de transação
 */
export declare enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    TRANSFER = "transfer"
}
/**
 * Enum para status de transação
 */
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Interface para o modelo de Transação
 */
export interface ITransaction extends Document {
    type: TransactionType;
    amount: number;
    sourceAccount?: mongoose.Types.ObjectId;
    destinationAccount?: mongoose.Types.ObjectId;
    description?: string;
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}
declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Transaction;
