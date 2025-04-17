import { ITransactionReportService } from './transaction-report.service';
import { IAuthService } from './auth.service';
import { IUserService } from './user.service';
import { IAccountService } from './account.service';
import { ITransactionService } from './transaction.service';
/**
 * Arquivo de índice para exportar todos os serviços
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */
declare const authService: IAuthService;
declare const userService: IUserService;
declare const accountService: IAccountService;
declare const transactionService: ITransactionService;
declare const transactionReportService: ITransactionReportService;
export { IAuthService, IUserService, IAccountService, ITransactionService, ITransactionReportService };
export { authService, userService, accountService, transactionService, transactionReportService };
