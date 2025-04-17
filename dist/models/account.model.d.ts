import mongoose, { Document } from 'mongoose';
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
interface AccountStatics {
    generateAccountNumber(): Promise<string>;
}
declare const Account: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount> & IAccount & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any> & AccountStatics;
export default Account;
