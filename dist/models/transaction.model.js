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
exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Enum para tipos de transação
 */
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAWAL"] = "withdrawal";
    TransactionType["TRANSFER"] = "transfer";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/**
 * Enum para status de transação
 */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/**
 * Schema do Mongoose para o modelo de Transação
 */
const TransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: [true, 'Tipo de transação é obrigatório'],
    },
    amount: {
        type: Number,
        required: [true, 'Valor da transação é obrigatório'],
        min: [0.01, 'Valor da transação deve ser maior que zero'],
    },
    sourceAccount: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Account',
        required: function () {
            // Obrigatório para saques e transferências
            return this.type === TransactionType.WITHDRAWAL ||
                this.type === TransactionType.TRANSFER;
        },
    },
    destinationAccount: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Account',
        required: function () {
            // Obrigatório para depósitos e transferências
            return this.type === TransactionType.DEPOSIT ||
                this.type === TransactionType.TRANSFER;
        },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Descrição não pode ter mais de 200 caracteres'],
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
    },
}, {
    timestamps: true, // Adiciona createdAt e updatedAt
});
/**
 * Índices para melhorar a performance de consultas
 */
TransactionSchema.index({ sourceAccount: 1, createdAt: -1 });
TransactionSchema.index({ destinationAccount: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });
const Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
exports.default = Transaction;
//# sourceMappingURL=transaction.model.js.map