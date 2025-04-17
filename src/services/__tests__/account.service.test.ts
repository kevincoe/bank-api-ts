import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AccountService } from '../../services/account.service';
import { AccountRepository } from '../../repositories/account.repository';
import { Account, User } from '../../models';
import { AppError } from '../../utils/error.utils';
import { AccountType } from '../../models/account.model'; // Import the enum

describe('Account Service', () => {
  let mongoServer: MongoMemoryServer;
  let accountService: AccountService;
  let testUser: any;
  let testAccount: any;
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    
    // Create dependencies
    const accountRepository = new AccountRepository(Account);
    accountService = new AccountService(accountRepository);
    
    // Create test user
    testUser = await User.create({
      name: 'Account Test User',
      email: 'account.test@example.com',
      password: 'Password123',
      cpf: '12345678900',
      role: 'cliente' // Use valid enum value
    });
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    await Account.deleteMany({});
    
    // Create a test account before each test
    testAccount = await Account.create({
      accountNumber: '12345678',
      type: AccountType.CHECKING, // Use enum value
      balance: 1000,
      user: testUser._id,
      isActive: true
    });
  });
  
  describe('getAccountById', () => {
    it('should get account by id', async () => {
      const account = await accountService.getAccountById(testAccount._id.toString());
      expect(account).toBeTruthy();
      expect(account?.accountNumber).toBe(testAccount.accountNumber);
    });
    
    it('should throw error if account not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(accountService.getAccountById(nonExistentId.toString()))
        .rejects
        .toThrow(AppError);
    });
  });
  
  describe('createAccount', () => {
    it('should create a new account with provided data', async () => {
      const accountData = {
        type: AccountType.SAVINGS, // Use enum value
        user: testUser._id,
        balance: 500
      };
      
      const newAccount = await accountService.createAccount(accountData);
      
      expect(newAccount).toBeTruthy();
      expect(newAccount.type).toBe(accountData.type);
      expect(newAccount.balance).toBe(accountData.balance);
      expect(newAccount.user.toString()).toBe(testUser._id.toString());
      expect(newAccount.accountNumber).toBeTruthy(); // Should generate account number
    });
    
    it('should create account with default values when not provided', async () => {
      const accountData = {
        user: testUser._id
      };
      
      const newAccount = await accountService.createAccount(accountData);
      
      expect(newAccount).toBeTruthy();
      expect(newAccount.type).toBe(AccountType.CHECKING); // Default type
      expect(newAccount.balance).toBe(0); // Default balance
    });
  });
  
  describe('updateAccount', () => {
    it('should update account type', async () => {
      const updatedAccount = await accountService.updateAccount(
        testAccount._id.toString(),
        { type: AccountType.SAVINGS } // Use enum value
      );
      
      expect(updatedAccount.type).toBe(AccountType.SAVINGS);
    });
    
    it('should throw error when trying to change account number', async () => {
      await expect(accountService.updateAccount(
        testAccount._id.toString(),
        { accountNumber: '87654321' }
      )).rejects.toThrow('Não é permitido alterar o número da conta');
    });
    
    it('should throw error when trying to change account owner', async () => {
      const anotherUserId = new mongoose.Types.ObjectId();
      
      await expect(accountService.updateAccount(
        testAccount._id.toString(),
        { user: anotherUserId }
      )).rejects.toThrow('Não é permitido alterar o usuário associado à conta');
    });
  });
  
  describe('deactivateAccount', () => {
    it('should deactivate an active account', async () => {
      const deactivatedAccount = await accountService.deactivateAccount(testAccount._id.toString());
      
      expect(deactivatedAccount.isActive).toBe(false);
    });
    
    it('should throw error for already inactive account', async () => {
      // First deactivate the account
      await accountService.deactivateAccount(testAccount._id.toString());
      
      // Try to deactivate again
      await expect(accountService.deactivateAccount(testAccount._id.toString()))
        .rejects
        .toThrow('Conta já está desativada');
    });
  });
  
  describe('deleteAccount', () => {
    it('should delete account with zero balance', async () => {
      // Create account with zero balance
      const zeroBalanceAccount = await Account.create({
        accountNumber: '87654321',
        type: AccountType.CHECKING,
        balance: 0,
        user: testUser._id,
        isActive: true
      });
      
      // Fix: Add type assertion to explicitly set the type
      const result = await accountService.deleteAccount(
        (zeroBalanceAccount as any)._id.toString()
      );
      expect(result).toBe(true);
      
      // Verify account was deleted
      const deletedAccount = await Account.findById(zeroBalanceAccount._id);
      expect(deletedAccount).toBeNull();
    });
    
    it('should throw error when deleting account with positive balance', async () => {
      await expect(accountService.deleteAccount(testAccount._id.toString()))
        .rejects
        .toThrow('Não é possível remover uma conta com saldo');
    });
  });
});