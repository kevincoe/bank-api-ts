"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const account_service_1 = require("../../services/account.service");
const account_repository_1 = require("../../repositories/account.repository");
const models_1 = require("../../models");
const error_utils_1 = require("../../utils/error.utils");
const account_model_1 = require("../../models/account.model"); // Import the enum
describe('Account Service', () => {
    let mongoServer;
    let accountService;
    let testUser;
    let testAccount;
    beforeAll(async () => {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        await mongoose_1.default.connect(mongoServer.getUri());
        // Create dependencies
        const accountRepository = new account_repository_1.AccountRepository(models_1.Account);
        accountService = new account_service_1.AccountService(accountRepository);
        // Create test user
        testUser = await models_1.User.create({
            name: 'Account Test User',
            email: 'account.test@example.com',
            password: 'Password123',
            cpf: '12345678900',
            role: 'cliente' // Use valid enum value
        });
    });
    afterAll(async () => {
        await mongoose_1.default.disconnect();
        await mongoServer.stop();
    });
    beforeEach(async () => {
        await models_1.Account.deleteMany({});
        // Create a test account before each test
        testAccount = await models_1.Account.create({
            accountNumber: '12345678',
            type: account_model_1.AccountType.CHECKING, // Use enum value
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
            const nonExistentId = new mongoose_1.default.Types.ObjectId();
            await expect(accountService.getAccountById(nonExistentId.toString()))
                .rejects
                .toThrow(error_utils_1.AppError);
        });
    });
    describe('createAccount', () => {
        it('should create a new account with provided data', async () => {
            const accountData = {
                type: account_model_1.AccountType.SAVINGS, // Use enum value
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
            expect(newAccount.type).toBe(account_model_1.AccountType.CHECKING); // Default type
            expect(newAccount.balance).toBe(0); // Default balance
        });
    });
    describe('updateAccount', () => {
        it('should update account type', async () => {
            const updatedAccount = await accountService.updateAccount(testAccount._id.toString(), { type: account_model_1.AccountType.SAVINGS } // Use enum value
            );
            expect(updatedAccount.type).toBe(account_model_1.AccountType.SAVINGS);
        });
        it('should throw error when trying to change account number', async () => {
            await expect(accountService.updateAccount(testAccount._id.toString(), { accountNumber: '87654321' })).rejects.toThrow('Não é permitido alterar o número da conta');
        });
        it('should throw error when trying to change account owner', async () => {
            const anotherUserId = new mongoose_1.default.Types.ObjectId();
            await expect(accountService.updateAccount(testAccount._id.toString(), { user: anotherUserId })).rejects.toThrow('Não é permitido alterar o usuário associado à conta');
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
            const zeroBalanceAccount = await models_1.Account.create({
                accountNumber: '87654321',
                type: account_model_1.AccountType.CHECKING,
                balance: 0,
                user: testUser._id,
                isActive: true
            });
            // Fix: Add type assertion to explicitly set the type
            const result = await accountService.deleteAccount(zeroBalanceAccount._id.toString());
            expect(result).toBe(true);
            // Verify account was deleted
            const deletedAccount = await models_1.Account.findById(zeroBalanceAccount._id);
            expect(deletedAccount).toBeNull();
        });
        it('should throw error when deleting account with positive balance', async () => {
            await expect(accountService.deleteAccount(testAccount._id.toString()))
                .rejects
                .toThrow('Não é possível remover uma conta com saldo');
        });
    });
});
//# sourceMappingURL=account.service.test.js.map