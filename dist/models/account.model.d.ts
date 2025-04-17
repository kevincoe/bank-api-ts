import mongoose, { Document, Model } from 'mongoose';
/**
 * Enum para tipos de conta
 */
export declare enum AccountType {
    CHECKING = "checking",
    SAVINGS = "savings",
    INVESTMENT = "investment"
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
interface IAccountModel extends Model<IAccount> {
    generateAccountNumber(): Promise<string>;
}
declare const Account: IAccountModel;
export default Account;
