"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRepository = exports.accountRepository = exports.userRepository = void 0;
const user_repository_1 = require("./user.repository");
const account_repository_1 = require("./account.repository");
const transaction_repository_1 = require("./transaction.repository");
const models_1 = require("../models");
/**
 * Arquivo de índice para exportar todos os repositórios
 * Facilita a importação em outros arquivos e centraliza a criação de instâncias
 */
// Criação de instâncias dos repositórios
const userRepository = new user_repository_1.UserRepository(models_1.User);
exports.userRepository = userRepository;
const accountRepository = new account_repository_1.AccountRepository(models_1.Account);
exports.accountRepository = accountRepository;
const transactionRepository = new transaction_repository_1.TransactionRepository(models_1.Transaction);
exports.transactionRepository = transactionRepository;
//# sourceMappingURL=index.js.map