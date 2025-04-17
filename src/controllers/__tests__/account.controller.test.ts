import request from 'supertest';
import mongoose from 'mongoose';
import App from '../../app';
import { User, Account } from '../../models'; 
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Account Controller', () => {
  let app: App;
  let mongoServer: MongoMemoryServer;
  let authToken: string;
  let userId: string;
  
  beforeAll(async () => {
    // Configurar banco de dados em memória para testes
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Substituir a URI do MongoDB no ambiente de teste
    process.env.MONGODB_URI = mongoUri;
    
    // Inicializar a aplicação
    app = new App();
    
    // Conectar ao banco de dados de teste
    await mongoose.connect(mongoUri);
    
    // Criar um usuário para testes
    const userData = {
      name: 'Usuário Teste',
      email: 'teste@email.com',
      password: 'Senha@123',
      cpf: '12345678900',
      role: 'admin' // Admin para ter acesso a todas as operações
    };
    
    const response = await request(app.app)
      .post('/api/auth/register')
      .send(userData);
    
    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });
  
  afterAll(async () => {
    // Desconectar do banco de dados e parar o servidor
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Limpar coleção de contas antes de cada teste
    await Account.deleteMany({});
  });
  
  describe('POST /api/accounts', () => {
    it('deve criar uma nova conta com sucesso', async () => {
      const accountData = {
        type: 'checking',
        user: userId,
        balance: 1000
      };
      
      const response = await request(app.app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accountData)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data.account.type).toBe(accountData.type);
      expect(response.body.data.account.balance).toBe(accountData.balance);
      expect(response.body.data.account.user.toString()).toBe(userId);
      expect(response.body.data.account).toHaveProperty('accountNumber');
      
      // Verificar se a conta foi salva no banco
      const savedAccount = await Account.findById(response.body.data.account.id);
      expect(savedAccount).toBeTruthy();
      expect(savedAccount?.type).toBe(accountData.type);
    });
    
    it('deve retornar erro de validação para dados inválidos', async () => {
      const invalidData = {
        type: 'tipo_invalido', // Tipo inválido
        user: userId
      };
      
      const response = await request(app.app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body.status).toBe('error');
    });
    
    it('deve retornar erro para usuário não autenticado', async () => {
      const accountData = {
        type: 'checking',
        user: userId
      };
      
      const response = await request(app.app)
        .post('/api/accounts')
        .send(accountData)
        .expect(401);
      
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('GET /api/accounts', () => {
    it('deve listar todas as contas', async () => {
      // Criar algumas contas para teste
      await Account.create({
        type: 'checking',
        user: new mongoose.Types.ObjectId(userId), // Convert string ID to ObjectId
        balance: 1000,
        accountNumber: '123456'
      });
      
      const response = await request(app.app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('accounts');
      expect(Array.isArray(response.body.data.accounts)).toBe(true);
      expect(response.body.data.accounts.length).toBe(2);
    });
    
    it('deve retornar erro para usuário não autenticado', async () => {
      const response = await request(app.app)
        .get('/api/accounts')
        .expect(401);
      
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('GET /api/accounts/:id', () => {
    it('deve obter uma conta pelo ID', async () => {
      // Criar uma conta para teste
      const account = await Account.create({
        type: 'checking',
        user: userId,
        balance: 1000,
        accountNumber: '123456'
      });
      
      const response = await request(app.app)
        .get(`/api/accounts/${account.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data.account.id).toBe(account.id.toString());
      expect(response.body.data.account.type).toBe(account.type);
    });
    
    it('deve retornar erro para conta não encontrada', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app.app)
        .get(`/api/accounts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
      
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('PATCH /api/accounts/:id', () => {
    it('deve atualizar uma conta existente', async () => {
      // Criar uma conta para teste
      const account = await Account.create({
        type: 'checking',
        user: userId,
        balance: 1000,
        accountNumber: '123456'
      });
      
      const updateData = {
        type: 'savings'
      };
      
      const response = await request(app.app)
        .patch(`/api/accounts/${account.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data.account.type).toBe(updateData.type);
      
      // Verificar se a conta foi atualizada no banco
      const updatedAccount = await Account.findById(account.id);
      expect(updatedAccount?.type).toBe(updateData.type);
    });
  });
  
  describe('DELETE /api/accounts/:id', () => {
    it('deve remover uma conta', async () => {
      // Criar uma conta para teste
      const account = await Account.create({
        type: 'checking',
        user: userId,
        balance: 0, // Saldo zero para permitir remoção
        accountNumber: '123456'
      });
      
      const response = await request(app.app)
        .delete(`/api/accounts/${account.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      
      // Verificar se a conta foi removida do banco
      const deletedAccount = await Account.findById(account.id);
      expect(deletedAccount).toBeNull();
    });
    
    it('deve retornar erro ao tentar remover conta com saldo', async () => {
      // Criar uma conta para teste com saldo
      const account = await Account.create({
        type: 'checking',
        user: userId,
        balance: 1000,
        accountNumber: '123456'
      });
      
      const response = await request(app.app)
        .delete(`/api/accounts/${account.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('saldo');
      
      // Verificar se a conta ainda existe no banco
      const existingAccount = await Account.findById(account.id);
      expect(existingAccount).toBeTruthy();
    });
  });
});
