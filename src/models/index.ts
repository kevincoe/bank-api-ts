import { IUser } from './user.model';
import { IAccount } from './account.model';
import { ITransaction } from './transaction.model';

/**
 * Arquivo de índice para exportar todos os modelos
 * Facilita a importação em outros arquivos
 */

export { default as User, IUser } from './user.model';
export { default as Account, IAccount, AccountType } from './account.model';
export { 
  default as Transaction, 
  ITransaction, 
  TransactionType, 
  TransactionStatus 
} from './transaction.model';
