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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Enum para tipos de conta
 */
var AccountType;
(function (AccountType) {
    AccountType["CHECKING"] = "checking";
    AccountType["SAVINGS"] = "savings";
    AccountType["INVESTMENT"] = "investment";
})(AccountType || (exports.AccountType = AccountType = {}));
/**
 * Schema do Mongoose para o modelo de Conta
 */
const AccountSchema = new mongoose_1.Schema({
    accountNumber: {
        type: String,
        required: [true, 'Número da conta é obrigatório'],
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.CHECKING,
        required: [true, 'Tipo de conta é obrigatório'],
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, 'Saldo não pode ser negativo para contas comuns'],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Conta deve estar associada a um usuário'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
/**
 * Método estático para gerar número de conta único
 */
// Alternative approach: define the function separately
async function generateAccountNumber() {
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    const accountNumber = randomNum.toString();
    // @ts-ignore - Using 'this' as the model in the static context
    const existingAccount = await this.findOne({ accountNumber });
    if (existingAccount) {
        // @ts-ignore - Using 'this' for recursion in the static context
        return this.generateAccountNumber();
    }
    return accountNumber;
}
// Assign the function to the schema statics
AccountSchema.statics.generateAccountNumber = generateAccountNumber;
// Create the model with the proper typing
const Account = mongoose_1.default.model('Account', AccountSchema);
exports.default = Account;
//# sourceMappingURL=account.model.js.map