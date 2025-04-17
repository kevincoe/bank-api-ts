/**
 * Validadores para operações de transações
 */
/**
 * Validação para depósito
 */
export declare const depositValidation: import("express-validator").ValidationChain[];
/**
 * Validação para saque
 */
export declare const withdrawValidation: import("express-validator").ValidationChain[];
/**
 * Validação para transferência
 */
export declare const transferValidation: import("express-validator").ValidationChain[];
/**
 * Validação para busca de transação por ID
 */
export declare const getTransactionByIdValidation: import("express-validator").ValidationChain[];
/**
 * Validação para busca de transações por conta
 */
export declare const getAccountTransactionsValidation: import("express-validator").ValidationChain[];
/**
 * Validação para cancelamento de transação
 */
export declare const cancelTransactionValidation: import("express-validator").ValidationChain[];
