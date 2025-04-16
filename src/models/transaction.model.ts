import mongoose, { Schema, Document } from 'mongoose';

/**
 * Enum para tipos de transação
 */
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer'
}

/**
 * Enum para status de transação
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
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

/**
 * Schema do Mongoose para o modelo de Transação
 */
const TransactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Tipo de transação é obrigatório'],
    },
    amount: {
      type: Number,
      required: [true, 'Valor da transação é obrigatório'],
      min: [0.01, 'Valor da transação deve ser maior que zero'],
    },
    sourceAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: function(this: ITransaction) {
        // Obrigatório para saques e transferências
        return this.type === TransactionType.WITHDRAWAL || 
               this.type === TransactionType.TRANSFER;
      },
    },
    destinationAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: function(this: ITransaction) {
        // Obrigatório para depósitos e transferências
        return this.type === TransactionType.DEPOSIT || 
               this.type === TransactionType.TRANSFER;
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Descrição não pode ter mais de 200 caracteres'],
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

/**
 * Índices para melhorar a performance de consultas
 */
TransactionSchema.index({ sourceAccount: 1, createdAt: -1 });
TransactionSchema.index({ destinationAccount: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
