import mongoose, { Schema, Document } from 'mongoose';

/**
 * Enum para tipos de conta
 */
export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  INVESTMENT = 'investment'
}

/**
 * Interface para o modelo de Conta
 */
export interface IAccount extends Document {
  accountNumber: string;
  type: AccountType;
  balance: number;
  user: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema do Mongoose para o modelo de Conta
 */
const AccountSchema: Schema = new Schema(
  {
    accountNumber: {
      type: String,
      required: [true, 'Número da conta é obrigatório'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.CHECKING,
      required: [true, 'Tipo de conta é obrigatório'],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Saldo não pode ser negativo para contas comuns'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Conta deve estar associada a um usuário'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

/**
 * Método estático para gerar número de conta único
 */
AccountSchema.statics.generateAccountNumber = async function(): Promise<string> {
  // Gera um número aleatório de 10 dígitos
  const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  const accountNumber = randomNum.toString();
  
  // Verifica se já existe
  const existingAccount = await this.findOne({ accountNumber });
  if (existingAccount) {
    // Recursivamente tenta gerar outro número se já existir
    return this.generateAccountNumber();
  }
  
  return accountNumber;
};

const Account = mongoose.model<IAccount>('Account', AccountSchema);

export default Account;
