import { IUserRepository } from './user.repository';
import { IAccountRepository } from './account.repository';
import { ITransactionRepository } from './transaction.repository';
/**
 * Arquivo de índice para exportar todos os repositórios
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */
declare const userRepository: IUserRepository;
declare const accountRepository: IAccountRepository;
declare const transactionRepository: ITransactionRepository;
export { IUserRepository, IAccountRepository, ITransactionRepository };
export { userRepository, accountRepository, transactionRepository };
