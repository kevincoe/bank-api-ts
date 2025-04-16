import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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

/**
 * Schema do Mongoose para o modelo de Usuário
 */
const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, forneça um email válido'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
      select: false, // Não retorna a senha nas consultas
    },
    cpf: {
      type: String,
      required: [true, 'CPF é obrigatório'],
      unique: true,
      trim: true,
      match: [/^\d{11}$/, 'CPF deve conter 11 dígitos numéricos'],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

/**
 * Middleware para hash da senha antes de salvar
 */
UserSchema.pre<IUser>('save', async function (next) {
  // Só executa se a senha foi modificada ou é nova
  if (!this.isModified('password')) return next();

  try {
    // Gera um salt
    const salt = await bcrypt.genSalt(10);
    // Hash da senha com o salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Método para comparar senha
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senha');
  }
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
