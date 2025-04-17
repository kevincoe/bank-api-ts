"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionReportService = exports.transactionService = exports.accountService = exports.userService = exports.authService = void 0;
const transaction_report_service_1 = require("./transaction-report.service");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("./user.service");
const account_service_1 = require("./account.service");
const transaction_service_1 = require("./transaction.service");
const repositories_1 = require("../repositories");
/**
 * Arquivo de índice para exportar todos os serviços
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */
// Criação de instâncias dos serviços
const authService = new auth_service_1.AuthService(repositories_1.userRepository);
exports.authService = authService;
const userService = new user_service_1.UserService(repositories_1.userRepository);
exports.userService = userService;
const accountService = new account_service_1.AccountService(repositories_1.accountRepository);
exports.accountService = accountService;
const transactionService = new transaction_service_1.TransactionService(repositories_1.transactionRepository, repositories_1.accountRepository);
exports.transactionService = transactionService;
const transactionReportService = new transaction_report_service_1.TransactionReportService(repositories_1.transactionRepository, repositories_1.accountRepository);
exports.transactionReportService = transactionReportService;
//# sourceMappingURL=index.js.map