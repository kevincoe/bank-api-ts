"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-api',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
exports.default = config;
//# sourceMappingURL=config.js.map