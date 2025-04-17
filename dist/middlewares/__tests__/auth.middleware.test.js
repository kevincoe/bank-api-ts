"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../app"));
const models_1 = require("../../models");
const config_1 = __importDefault(require("../../config/config"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe('Auth Middleware', () => {
    let app;
    let mongoServer;
    let validToken;
    let expiredToken;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        process.env.MONGODB_URI = mongoServer.getUri();
        app = new app_1.default();
        await mongoose_1.default.connect(mongoServer.getUri());
        // Fix: Change 'cliente' to 'user' which is likely a valid enum value
        // Check your user.model.ts for valid role values and use one of them
        const testUser = await models_1.User.create({
            name: 'Test User',
            email: 'auth.middleware@test.com',
            password: 'Password123',
            cpf: '12345678900',
            role: 'user' // Change from 'cliente' to a valid role enum value
        });
        // Create valid token
        validToken = jsonwebtoken_1.default.sign({ id: testUser._id }, config_1.default.jwtSecret, { expiresIn: '1h' });
        // Create expired token
        expiredToken = jsonwebtoken_1.default.sign({ id: testUser._id }, config_1.default.jwtSecret, { expiresIn: '0s' });
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    describe('protect middleware', () => {
        it('should allow access with valid token', async () => {
            // Create test endpoint protected by auth middleware if needed
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/accounts') // Use an existing protected route
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);
            expect(response.status).not.toBe(401);
        });
        it('should deny access when no token is provided', async () => {
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/accounts')
                .expect(401);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('Token não fornecido');
        });
        it('should deny access with invalid token format', async () => {
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/accounts')
                .set('Authorization', 'InvalidPrefix token123')
                .expect(401);
            expect(response.body.status).toBe('error');
        });
        it('should deny access with expired token', async () => {
            // Wait to ensure token expires
            await new Promise(r => setTimeout(r, 1000));
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/accounts')
                .set('Authorization', `Bearer ${expiredToken}`)
                .expect(401);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('expirado');
        });
    });
    describe('restrictTo middleware', () => {
        it('should allow access to admin-only routes for admin users', async () => {
            // Create admin user
            const adminUser = await models_1.User.create({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'Password123',
                cpf: '98765432100',
                role: 'admin' // Make sure 'admin' is a valid enum value
            });
            const adminToken = jsonwebtoken_1.default.sign({ id: adminUser._id }, config_1.default.jwtSecret, { expiresIn: '1h' });
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
            expect(response.status).not.toBe(403);
        });
        it('should deny access to admin-only routes for regular users', async () => {
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('permissão');
        });
    });
});
//# sourceMappingURL=auth.middleware.test.js.map