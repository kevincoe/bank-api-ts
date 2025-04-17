"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Classe responsável por gerenciar a conexão com o MongoDB
 */
class Database {
    /**
     * Inicializa a conexão com o MongoDB
     */
    static async connect() {
        try {
            const options = {
                autoIndex: true,
            };
            await mongoose_1.default.connect(config_1.default.mongoUri);
            console.log('Conexão com o MongoDB estabelecida com sucesso');
            mongoose_1.default.connection.on('error', (err) => {
                console.error(`Erro na conexão com o MongoDB: ${err}`);
            });
        }
        catch (error) {
            console.error('Não foi possível conectar ao MongoDB:', error);
            process.exit(1);
        }
    }
    /**
     * Fecha a conexão com o MongoDB
     */
    static async disconnect() {
        try {
            await mongoose_1.default.disconnect();
            console.log('Conexão com o MongoDB fechada com sucesso');
        }
        catch (error) {
            console.error('Erro ao fechar a conexão com o MongoDB:', error);
        }
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map