import { UserRepository, IUserRepository } from './user.repository';
import { AccountRepository, IAccountRepository } from './account.repository';
import { TransactionRepository, ITransactionRepository } from './transaction.repository';
import { User, Account, Transaction } from '../models';

/**
 * Arquivo de índice para exportar todos os repositórios
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */

// Criação de instâncias dos repositórios
const userRepository: IUserRepository = new UserRepository(User);
const accountRepository: IAccountRepository = new AccountRepository(Account);
const transactionRepository: ITransactionRepository = new TransactionRepository(Transaction);

// Exportação das interfaces
export {
  IUserRepository,
  IAccountRepository,
  ITransactionRepository
};

// Exportação das instâncias
export {
  userRepository,
  accountRepository,
  transactionRepository
};
