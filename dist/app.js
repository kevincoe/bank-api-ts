"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = __importDefault(require("./config/database"));
const error_utils_1 = require("./utils/error.utils");
const swagger_utils_1 = require("./utils/swagger.utils");
const middlewares_1 = require("./middlewares");
const routes_1 = require("./routes");
/**
 * Classe principal da aplicação
 */
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureSwagger();
        this.configureErrorHandling();
    }
    /**
     * Configura os middlewares da aplicação
     */
    configureMiddlewares() {
        // Segurança básica
        this.app.use((0, helmet_1.default)());
        this.app.use(middlewares_1.securityMiddleware.securityHeaders.bind(middlewares_1.securityMiddleware));
        // CORS
        this.app.use((0, cors_1.default)());
        // Logging
        if (config_1.default.env === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        // Limitação de taxa - 100 requisições por 15 minutos
        const rateLimit = require('express-rate-limit');
        this.app.use(rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        }));
        // Validação e sanitização
        this.app.use(middlewares_1.securityMiddleware.validateContentType.bind(middlewares_1.securityMiddleware));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(middlewares_1.securityMiddleware.preventNoSql.bind(middlewares_1.securityMiddleware));
        this.app.use(middlewares_1.securityMiddleware.sanitizeData.bind(middlewares_1.securityMiddleware));
    }
    /**
     * Configura as rotas da aplicação
     */
    configureRoutes() {
        // Rota de saúde da API
        this.app.get('/api/health', (req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'API está funcionando corretamente',
                timestamp: new Date().toISOString(),
                environment: config_1.default.env,
            });
        });
        // Rotas da API
        this.app.use('/api/auth', routes_1.authRoutes);
        this.app.use('/api/profile', routes_1.profileRoutes);
        this.app.use('/api/users', routes_1.userRoutes);
        this.app.use('/api/accounts', routes_1.accountRoutes);
        this.app.use('/api/transactions', routes_1.transactionRoutes);
        this.app.use('/api/reports', routes_1.transactionReportRoutes);
    }
    /**
     * Configura o Swagger para documentação da API
     */
    configureSwagger() {
        (0, swagger_utils_1.setupSwagger)(this.app);
    }
    /**
     * Configura o tratamento de erros
     */
    configureErrorHandling() {
        // Middleware para rotas não encontradas
        this.app.use((req, res, next) => {
            const err = new Error(`Rota não encontrada - ${req.originalUrl}`);
            res.status(404);
            next(err);
        });
        // Middleware para tratamento global de erros
        this.app.use(error_utils_1.errorHandler);
    }
    /**
     * Inicia o servidor
     */
    async start() {
        try {
            // Conecta ao banco de dados
            await database_1.default.connect();
            // Inicia o servidor
            this.app.listen(config_1.default.port, () => {
                // Use debug logs in production instead of console.log
                if (config_1.default.env === 'development') {
                    console.log(`Servidor rodando na porta ${config_1.default.port} em modo ${config_1.default.env}`);
                    console.log(`Documentação Swagger disponível em http://localhost:${config_1.default.port}/api/docs`);
                }
            });
        }
        catch (error) {
            if (config_1.default.env === 'development') {
                console.error('Erro ao iniciar o servidor:', error);
            }
            process.exit(1);
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map