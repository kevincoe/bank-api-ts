import mongoose, { Document } from 'mongoose';
/**
 * Interface para o modelo de Usuário
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    cpf: string;
    phone?: string;
    address?: string;
    role: 'client' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
