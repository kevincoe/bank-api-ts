"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../app"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const models_1 = require("../../models");
describe('Transaction Controller', () => {
    let app;
    let mongoServer;
    let authToken;
    let userId;
    let sourceAccountId;
    let destinationAccountId;
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
        // Criar um usuário para testes
        const userData = {
            name: 'Usuário Teste',
            email: 'teste@email.com',
            password: 'Senha@123',
            cpf: '12345678900',
            role: 'admin' // Admin para ter acesso a todas as operações
        };
        const response = await (0, supertest_1.default)(app.app)
            .post('/api/auth/register')
            .send(userData);
        authToken = response.body.data.token;
        userId = response.body.data.user.id;
        const sourceAccount = await models_1.Account.create({
            type: 'checking',
            user: new mongoose_1.default.Types.ObjectId(userId), // Must be a valid ObjectId
            balance: 1000,
            accountNumber: '123456'
        });
        const destinationAccount = await models_1.Account.create({
            type: 'savings',
            user: new mongoose_1.default.Types.ObjectId(userId), // Must be a valid ObjectId
            balance: 500,
            accountNumber: '654321'
        });
        sourceAccountId = sourceAccount.id;
        destinationAccountId = destinationAccount.id;
    });
    afterAll(async () => {
        // Desconectar do banco de dados e parar o servidor
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        // Limpar coleção de transações antes de cada teste
        await models_1.Transaction.deleteMany({});
        // Resetar saldos das contas
        await models_1.Account.findByIdAndUpdate(sourceAccountId, { balance: 1000 });
        await models_1.Account.findByIdAndUpdate(destinationAccountId, { balance: 500 });
    });
    describe('POST /api/transactions/deposit', () => {
        it('deve realizar um depósito com sucesso', async () => {
            const depositData = {
                destinationAccountId,
                amount: 500,
                description: 'Depósito de teste'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/deposit')
                .set('Authorization', `Bearer ${authToken}`)
                .send(depositData)
                .expect(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('transaction');
            expect(response.body.data.transaction.type).toBe('deposit');
            expect(response.body.data.transaction.amount).toBe(depositData.amount);
            expect(response.body.data.transaction.status).toBe('completed');
            // Verificar se o saldo da conta foi atualizado
            const updatedAccount = await models_1.Account.findById(destinationAccountId);
            expect(updatedAccount?.balance).toBe(1000); // 500 + 500
        });
        it('deve retornar erro para valor de depósito inválido', async () => {
            const invalidData = {
                destinationAccountId,
                amount: -100, // Valor negativo
                description: 'Depósito inválido'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/deposit')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidData)
                .expect(400);
            expect(response.body.status).toBe('error');
        });
    });
    describe('POST /api/transactions/withdraw', () => {
        it('deve realizar um saque com sucesso', async () => {
            const withdrawData = {
                sourceAccountId,
                amount: 300,
                description: 'Saque de teste'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/withdraw')
                .set('Authorization', `Bearer ${authToken}`)
                .send(withdrawData)
                .expect(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('transaction');
            expect(response.body.data.transaction.type).toBe('withdrawal');
            expect(response.body.data.transaction.amount).toBe(withdrawData.amount);
            expect(response.body.data.transaction.status).toBe('completed');
            // Verificar se o saldo da conta foi atualizado
            const updatedAccount = await models_1.Account.findById(sourceAccountId);
            expect(updatedAccount?.balance).toBe(700); // 1000 - 300
        });
        it('deve retornar erro para saque com saldo insuficiente', async () => {
            const withdrawData = {
                sourceAccountId,
                amount: 2000, // Valor maior que o saldo
                description: 'Saque inválido'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/withdraw')
                .set('Authorization', `Bearer ${authToken}`)
                .send(withdrawData)
                .expect(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Saldo insuficiente');
            // Verificar se o saldo da conta não foi alterado
            const account = await models_1.Account.findById(sourceAccountId);
            expect(account?.balance).toBe(1000);
        });
    });
    describe('POST /api/transactions/transfer', () => {
        it('deve realizar uma transferência com sucesso', async () => {
            const transferData = {
                sourceAccountId,
                destinationAccountId,
                amount: 300,
                description: 'Transferência de teste'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/transfer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(transferData)
                .expect(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('transaction');
            expect(response.body.data.transaction.type).toBe('transfer');
            expect(response.body.data.transaction.amount).toBe(transferData.amount);
            expect(response.body.data.transaction.status).toBe('completed');
            // Verificar se os saldos das contas foram atualizados
            const sourceAccount = await models_1.Account.findById(sourceAccountId);
            const destinationAccount = await models_1.Account.findById(destinationAccountId);
            expect(sourceAccount?.balance).toBe(700); // 1000 - 300
            expect(destinationAccount?.balance).toBe(800); // 500 + 300
        });
        it('deve retornar erro para transferência com saldo insuficiente', async () => {
            const transferData = {
                sourceAccountId,
                destinationAccountId,
                amount: 2000, // Valor maior que o saldo
                description: 'Transferência inválida'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/transfer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(transferData)
                .expect(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Saldo insuficiente');
            // Verificar se os saldos das contas não foram alterados
            const sourceAccount = await models_1.Account.findById(sourceAccountId);
            const destinationAccount = await models_1.Account.findById(destinationAccountId);
            expect(sourceAccount?.balance).toBe(1000);
            expect(destinationAccount?.balance).toBe(500);
        });
        it('deve retornar erro para transferência entre a mesma conta', async () => {
            const transferData = {
                sourceAccountId,
                destinationAccountId: sourceAccountId, // Mesma conta
                amount: 300,
                description: 'Transferência inválida'
            };
            const response = await (0, supertest_1.default)(app.app)
                .post('/api/transactions/transfer')
                .set('Authorization', `Bearer ${authToken}`)
                .send(transferData)
                .expect(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('mesma conta');
        });
    });
    describe('GET /api/transactions', () => {
        it('deve listar todas as transações', async () => {
            // Criar algumas transações para teste
            await models_1.Transaction.create([
                {
                    type: 'deposit',
                    amount: 200,
                    destinationAccount: destinationAccountId,
                    description: 'Depósito 1',
                    status: 'completed'
                },
                {
                    type: 'withdrawal',
                    amount: 100,
                    sourceAccount: sourceAccountId,
                    description: 'Saque 1',
                    status: 'completed'
                }
            ]);
            const response = await (0, supertest_1.default)(app.app)
                .get('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('transactions');
            expect(Array.isArray(response.body.data.transactions)).toBe(true);
            expect(response.body.data.transactions.length).toBe(2);
        });
    });
    describe('GET /api/transactions/:id', () => {
        it('deve obter uma transação pelo ID', async () => {
            // Criar uma transação para teste
            const transaction = await models_1.Transaction.create({
                type: 'deposit',
                amount: 200,
                destinationAccount: destinationAccountId,
                description: 'Depósito de teste',
                status: 'completed'
            });
            const response = await (0, supertest_1.default)(app.app)
                .get(`/api/transactions/${transaction.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('transaction');
            expect(response.body.data.transaction._id).toBe(transaction.id.toString());
            expect(response.body.data.transaction.type).toBe(transaction.type);
            expect(response.body.data.transaction.amount).toBe(transaction.amount);
        });
        it('deve retornar erro para transação não encontrada', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app.app)
                .get(`/api/transactions/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
            expect(response.body.status).toBe('error');
        });
    });
});
//# sourceMappingURL=transaction.controller.test.js.map