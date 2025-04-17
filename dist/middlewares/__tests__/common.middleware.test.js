"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const commonMiddleware = __importStar(require("../common.middleware"));
const error_utils_1 = require("../../utils/error.utils");
describe('Common Middleware', () => {
    let app;
    beforeAll(() => {
        app = new app_1.default();
    });
    describe('validateJSON middleware', () => {
        it('should pass valid JSON', async () => {
            // Mock objects
            const mockRequest = {
                body: { validKey: 'validValue' },
                is: jest.fn().mockReturnValue(true)
            };
            const mockResponse = {};
            const mockNext = jest.fn();
            // Call the middleware directly
            commonMiddleware.validateJSON(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalledWith();
        });
        it('should handle JSON syntax errors', async () => {
            // Use supertest to test the integrated middleware
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send('{invalid json}')
                .expect(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('JSON inválido');
        });
    });
    describe('rateLimiter middleware', () => {
        it('should allow requests within rate limit', async () => {
            // Make multiple requests but stay under limit
            for (let i = 0; i < 5; i++) {
                await (0, supertest_1.default)(app.app)
                    .get('/api/accounts')
                    .expect(response => {
                    expect(response.status).not.toBe(429);
                });
            }
        });
        it('should block requests exceeding rate limit', async () => {
            // Fix: Pass two separate arguments instead of one object
            // 2 = max requests, 1000 = time window in milliseconds
            const testLimiter = commonMiddleware.rateLimit(2, 1000);
            // Mock objects
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockNext = jest.fn();
            const mockReq = { ip: '127.0.0.1' };
            // First two calls should pass
            testLimiter(mockReq, mockRes, mockNext);
            testLimiter(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledTimes(2);
            // Third call should be rate limited
            testLimiter(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(429);
        });
    });
    describe('notFound middleware', () => {
        it('should pass AppError for unmatched routes', () => {
            const mockReq = {
                originalUrl: '/non-existent-route'
            };
            const mockRes = {};
            const mockNext = jest.fn();
            commonMiddleware.notFound(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
            // Use a safer way to check the error without using .mock property
            expect(mockNext).toHaveBeenCalledWith(expect.any(error_utils_1.AppError));
            expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 404
            }));
        });
    });
});
//# sourceMappingURL=common.middleware.test.js.map