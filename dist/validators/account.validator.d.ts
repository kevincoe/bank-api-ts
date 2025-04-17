/**
 * Validadores para operações de contas
 */
/**
 * Validação para criação de conta
 */
export declare const createAccountValidation: import("express-validator").ValidationChain[];
/**
 * Validação para atualização de conta
 */
export declare const updateAccountValidation: import("express-validator").ValidationChain[];
/**
 * Validação para busca de conta por ID
 */
export declare const getAccountByIdValidation: import("express-validator").ValidationChain[];
/**
 * Validação para busca de conta por número
 */
export declare const getAccountByNumberValidation: import("express-validator").ValidationChain[];
/**
 * Validação para busca de contas por usuário
 */
export declare const getUserAccountsValidation: import("express-validator").ValidationChain[];
/**
 * Validação para desativação de conta
 */
export declare const deactivateAccountValidation: import("express-validator").ValidationChain[];
/**
 * Validação para exclusão de conta
 */
export declare const deleteAccountValidation: import("express-validator").ValidationChain[];
