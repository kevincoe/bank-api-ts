import mongoose, { Schema, Document, Model } from 'mongoose';

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

// Define interface for the statics
interface AccountStatics {
  generateAccountNumber(): Promise<string>;
}

/**
 * Schema do Mongoose para o modelo de Conta
 */
const AccountSchema = new Schema(
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
    timestamps: true,
  }
);

/**
 * Método estático para gerar número de conta único
 */
// Alternative approach: define the function separately
async function generateAccountNumber(): Promise<string> {
  const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  const accountNumber = randomNum.toString();
  
  // @ts-ignore - Using 'this' as the model in the static context
  const existingAccount = await this.findOne({ accountNumber });
  if (existingAccount) {
    // @ts-ignore - Using 'this' for recursion in the static context
    return this.generateAccountNumber();
  }
  
  return accountNumber;
}

// Assign the function to the schema statics
AccountSchema.statics.generateAccountNumber = generateAccountNumber;

// Create the model with the proper typing
const Account = mongoose.model<IAccount, Model<IAccount> & AccountStatics>('Account', AccountSchema);

export default Account;