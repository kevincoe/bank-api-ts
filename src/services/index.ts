import { TransactionReportService, ITransactionReportService } from './transaction-report.service';
import { AuthService, IAuthService } from './auth.service';
import { UserService, IUserService } from './user.service';
import { AccountService, IAccountService } from './account.service';
import { TransactionService, ITransactionService } from './transaction.service';
import { userRepository, accountRepository, transactionRepository } from '../repositories';

/**
 * Arquivo de índice para exportar todos os serviços
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */

// Criação de instâncias dos serviços
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const accountService: IAccountService = new AccountService(accountRepository);
const transactionService: ITransactionService = new TransactionService(
  transactionRepository,
  accountRepository
);
const transactionReportService: ITransactionReportService = new TransactionReportService(
  transactionRepository,
  accountRepository
);

// Exportação das interfaces
export {
  IAuthService,
  IUserService,
  IAccountService,
  ITransactionService,
  ITransactionReportService
};

// Exportação das instâncias
export {
  authService,
  userService,
  accountService,
  transactionService,
  transactionReportService
};
