import { Request, Response, NextFunction } from 'express';
/**
 * Interface para erros da API
 */
export interface ApiError extends Error {
    statusCode: number;
    isOperational?: boolean;
    errors?: any;
    code?: number;
}
/**
 * Classe para erros da API
 */
export declare class AppError implements ApiError {
    readonly message: string;
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly name: string;
    readonly errors?: any;
    readonly code?: number;
    constructor(message: string, statusCode: number, isOperational?: boolean, errors?: any, code?: number);
    /**
     * Cria um erro de validação
     */
    static badRequest(message: string, errors?: any): AppError;
    /**
     * Cria um erro de autenticação
     */
    static unauthorized(message?: string): AppError;
    /**
     * Cria um erro de permissão
     */
    static forbidden(message?: string): AppError;
    /**
     * Cria um erro de recurso não encontrado
     */
    static notFound(message?: string): AppError;
    /**
     * Cria um erro de conflito
     */
    static conflict(message?: string): AppError;
    /**
     * Cria um erro interno do servidor
     */
    static internal(message?: string): AppError;
}
/**
 * Middleware para tratamento global de erros
 */
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => void;
