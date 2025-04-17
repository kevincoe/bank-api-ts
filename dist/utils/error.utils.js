"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * Classe para erros da API
 */
class AppError {
    constructor(message, statusCode, isOperational = true, errors, code) {
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Cria um erro de validação
     */
    static badRequest(message, errors) {
        return new AppError(message, 400, true, errors);
    }
    /**
     * Cria um erro de autenticação
     */
    static unauthorized(message = 'Não autorizado') {
        return new AppError(message, 401);
    }
    /**
     * Cria um erro de permissão
     */
    static forbidden(message = 'Acesso proibido') {
        return new AppError(message, 403);
    }
    /**
     * Cria um erro de recurso não encontrado
     */
    static notFound(message = 'Recurso não encontrado') {
        return new AppError(message, 404);
    }
    /**
     * Cria um erro de conflito
     */
    static conflict(message = 'Conflito de dados') {
        return new AppError(message, 409);
    }
    /**
     * Cria um erro interno do servidor
     */
    static internal(message = 'Erro interno do servidor') {
        return new AppError(message, 500, false);
    }
}
exports.AppError = AppError;
/**
 * Middleware para tratamento global de erros
 */
const errorHandler = (err, req, res, next) => {
    // Define valores padrão
    let statusCode = 500;
    let message = 'Erro interno do servidor';
    let isOperational = false;
    let errors = undefined;
    let code = undefined;
    // Verifica se é um erro da API
    if ('statusCode' in err) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational || false;
        errors = err.errors;
        code = err.code;
    }
    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Erro de validação';
        isOperational = true;
        errors = err;
    }
    // Erro de ID inválido do Mongoose
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID inválido ou recurso não encontrado';
        isOperational = true;
    }
    // Erro de duplicação do Mongoose
    if (err.name === 'MongoError' && err.code === 11000) {
        statusCode = 409;
        message = 'Dados duplicados. Este registro já existe.';
        isOperational = true;
        code = 11000;
    }
    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido. Por favor, faça login novamente.';
        isOperational = true;
    }
    // Erro de expiração de JWT
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Seu token expirou. Por favor, faça login novamente.';
        isOperational = true;
    }
    // Resposta para erros operacionais (esperados)
    if (isOperational) {
        const response = {
            status: 'error',
            message,
        };
        if (errors) {
            response.errors = errors;
        }
        if (code) {
            response.code = code;
        }
        // Adicionar informações de depuração em ambiente de desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }
        res.status(statusCode).json(response);
    }
    else {
        // Erro não operacional (não esperado) - log para depuração
        console.error('ERRO NÃO OPERACIONAL:', err);
        // Resposta genérica para o cliente
        res.status(500).json({
            status: 'error',
            message: 'Algo deu errado. Por favor, tente novamente mais tarde.',
        });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.utils.js.map