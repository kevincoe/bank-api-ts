"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_utils_1 = require("../../utils/error.utils");
describe('AppError', () => {
    it('deve criar um erro com as propriedades corretas', () => {
        const message = 'Erro de teste';
        const statusCode = 400;
        const isOperational = true;
        const error = new error_utils_1.AppError(message, statusCode, isOperational);
        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
        expect(error.isOperational).toBe(isOperational);
        expect(error.name).toBe('AppError');
    });
    it('deve criar um erro com isOperational=true por padrão', () => {
        const message = 'Erro de teste';
        const statusCode = 400;
        const error = new error_utils_1.AppError(message, statusCode);
        expect(error.isOperational).toBe(true);
    });
    it('deve criar um erro de validação com badRequest', () => {
        const message = 'Erro de validação';
        const errors = { email: ['Email inválido'] };
        const error = error_utils_1.AppError.badRequest(message, errors);
        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(400);
        expect(error.isOperational).toBe(true);
        expect(error.errors).toEqual(errors);
    });
    it('deve criar um erro de autenticação com unauthorized', () => {
        const error = error_utils_1.AppError.unauthorized();
        expect(error.message).toBe('Não autorizado');
        expect(error.statusCode).toBe(401);
        expect(error.isOperational).toBe(true);
    });
    it('deve criar um erro de permissão com forbidden', () => {
        const error = error_utils_1.AppError.forbidden();
        expect(error.message).toBe('Acesso proibido');
        expect(error.statusCode).toBe(403);
        expect(error.isOperational).toBe(true);
    });
    it('deve criar um erro de recurso não encontrado com notFound', () => {
        const error = error_utils_1.AppError.notFound();
        expect(error.message).toBe('Recurso não encontrado');
        expect(error.statusCode).toBe(404);
        expect(error.isOperational).toBe(true);
    });
    it('deve criar um erro de conflito com conflict', () => {
        const error = error_utils_1.AppError.conflict();
        expect(error.message).toBe('Conflito de dados');
        expect(error.statusCode).toBe(409);
        expect(error.isOperational).toBe(true);
    });
    it('deve criar um erro interno do servidor com internal', () => {
        const error = error_utils_1.AppError.internal();
        expect(error.message).toBe('Erro interno do servidor');
        expect(error.statusCode).toBe(500);
        expect(error.isOperational).toBe(false);
    });
});
//# sourceMappingURL=error.utils.test.js.map