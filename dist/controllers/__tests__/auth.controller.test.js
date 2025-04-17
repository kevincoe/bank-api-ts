"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../app"));
const models_1 = require("../../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config/config"));
describe('Auth Controller', () => {
    let app;
    let mongoServer;
    beforeAll(async () => {
        // Configurar banco de dados em memória para testes
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        // Substituir a URI do MongoDB no ambiente de teste
        process.env.MONGODB_URI = mongoUri;
        // Inicializar a aplicação
        app = new app_1.default();
        // Conectar ao banco de dados de teste
        await mongoose_1.default.connect(mongoUri);
    });
    afterAll(async () => {
        // Desconectar do banco de dados e parar o servidor
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        // Limpar coleções antes de cada teste
        await models_1.User.deleteMany({});
    });
    describe('POST /api/auth/register', () => {
        it('deve registrar um novo usuário com sucesso', async () => {
            const userData = {
                name: 'Usuário Teste',
                email: 'teste@email.com',
                password: 'Senha@123',
                cpf: '12345678900',
                phone: '11987654321',
                address: 'Rua Teste, 123'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBe(userData.name);
            expect(response.body.data.user).not.toHaveProperty('password');
            // Verificar se o usuário foi salvo no banco
            const savedUser = await models_1.User.findOne({ email: userData.email });
            expect(savedUser).toBeTruthy();
            expect(savedUser?.name).toBe(userData.name);
        });
        it('deve retornar erro ao tentar registrar com email já existente', async () => {
            // Criar usuário primeiro
            const userData = {
                name: 'Usuário Existente',
                email: 'existente@email.com',
                password: 'Senha@123',
                cpf: '12345678900',
                role: 'admin'
            };
            await models_1.User.create(userData);
            // Tentar registrar com mesmo email
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .send(userData)
                .expect(409);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('já existe');
        });
        it('deve retornar erro de validação para dados inválidos', async () => {
            const invalidData = {
                name: 'Te', // Nome muito curto
                email: 'email-invalido', // Email inválido
                password: '123', // Senha muito curta
                cpf: '123' // CPF inválido
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(400);
            expect(response.body.status).toBe('error');
            expect(response.body).toHaveProperty('errors');
        });
    });
    describe('POST /api/auth/login', () => {
        it('deve fazer login com sucesso', async () => {
            // Criar usuário para teste
            const userData = {
                name: 'Usuário Login',
                email: 'login@email.com',
                password: 'Senha@123',
                cpf: '12345678900',
                role: 'admin'
            };
            await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .send(userData);
            // Tentar fazer login
            const loginData = {
                email: userData.email,
                password: userData.password
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe(userData.email);
            // Verificar se o token é válido
            const token = response.body.data.token;
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            expect(decoded).toHaveProperty('id');
        });
        it('deve retornar erro para credenciais inválidas', async () => {
            // Criar usuário para teste
            const userData = {
                name: 'Usuário Credenciais',
                email: 'credenciais@email.com',
                password: 'Senha@123',
                cpf: '12345678900',
                role: 'admin'
            };
            await (0, supertest_1.default)(app.app)
                .post('/api/auth/register')
                .send(userData);
            // Tentar fazer login com senha errada
            const loginData = {
                email: userData.email,
                password: 'SenhaErrada'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('inválidas');
        });
        it('deve retornar erro para usuário não encontrado', async () => {
            const loginData = {
                email: 'naoexiste@email.com',
                password: 'Senha@123'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('inválidas');
        });
    });
});
//# sourceMappingURL=auth.controller.test.js.map