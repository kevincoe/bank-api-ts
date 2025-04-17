"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Configuração do Swagger
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Bancária',
            version: '1.0.0',
            description: 'API RESTful para uma solução bancária',
            contact: {
                name: 'Equipe de Desenvolvimento',
                email: 'dev@bancoapi.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${config_1.default.port}/api`,
                description: 'Servidor de Desenvolvimento',
            },
            {
                url: 'https://api.bancoapi.com/api',
                description: 'Servidor de Produção',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'cpf'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID do usuário',
                            example: '60d21b4667d0d8992e610c85',
                        },
                        name: {
                            type: 'string',
                            description: 'Nome completo do usuário',
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            description: 'Email do usuário',
                            format: 'email',
                            example: 'joao.silva@email.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Senha do usuário (hash)',
                            format: 'password',
                            example: '$2a$10$X/4XT5YQz3m4eKJ0YMVk2e6CyKgc7S8UT8YK5/1KAQGKYQo.qKfYy',
                        },
                        cpf: {
                            type: 'string',
                            description: 'CPF do usuário',
                            example: '12345678900',
                        },
                        role: {
                            type: 'string',
                            description: 'Papel do usuário no sistema',
                            enum: ['user', 'admin'],
                            example: 'user',
                        },
                        phone: {
                            type: 'string',
                            description: 'Telefone do usuário',
                            example: '11987654321',
                        },
                        address: {
                            type: 'string',
                            description: 'Endereço do usuário',
                            example: 'Rua Exemplo, 123 - São Paulo, SP',
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Status de ativação do usuário',
                            example: true,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação do usuário',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de atualização do usuário',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                Account: {
                    type: 'object',
                    required: ['type', 'user'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID da conta',
                            example: '60d21b4667d0d8992e610c86',
                        },
                        accountNumber: {
                            type: 'string',
                            description: 'Número da conta',
                            example: '123456789',
                        },
                        type: {
                            type: 'string',
                            description: 'Tipo da conta',
                            enum: ['checking', 'savings', 'investment'],
                            example: 'checking',
                        },
                        balance: {
                            type: 'number',
                            description: 'Saldo da conta',
                            example: 1000.50,
                        },
                        user: {
                            type: 'string',
                            description: 'ID do usuário proprietário da conta',
                            example: '60d21b4667d0d8992e610c85',
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Status de ativação da conta',
                            example: true,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação da conta',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de atualização da conta',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                Transaction: {
                    type: 'object',
                    required: ['type', 'amount'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID da transação',
                            example: '60d21b4667d0d8992e610c87',
                        },
                        type: {
                            type: 'string',
                            description: 'Tipo da transação',
                            enum: ['deposit', 'withdrawal', 'transfer'],
                            example: 'deposit',
                        },
                        amount: {
                            type: 'number',
                            description: 'Valor da transação',
                            example: 500.00,
                        },
                        sourceAccount: {
                            type: 'string',
                            description: 'ID da conta de origem (para saques e transferências)',
                            example: '60d21b4667d0d8992e610c86',
                        },
                        destinationAccount: {
                            type: 'string',
                            description: 'ID da conta de destino (para depósitos e transferências)',
                            example: '60d21b4667d0d8992e610c88',
                        },
                        description: {
                            type: 'string',
                            description: 'Descrição da transação',
                            example: 'Depósito inicial',
                        },
                        status: {
                            type: 'string',
                            description: 'Status da transação',
                            enum: ['pending', 'completed', 'failed', 'cancelled'],
                            example: 'completed',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação da transação',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de atualização da transação',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            description: 'Status da resposta',
                            example: 'error',
                        },
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro',
                            example: 'Recurso não encontrado',
                        },
                        errors: {
                            type: 'object',
                            description: 'Detalhes dos erros de validação',
                            example: {
                                email: ['Email inválido'],
                                password: ['Senha deve ter pelo menos 8 caracteres'],
                            },
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token de acesso ausente, inválido ou expirado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                status: 'error',
                                message: 'Não autorizado. Token não fornecido ou inválido.',
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: 'Recurso não encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                status: 'error',
                                message: 'Recurso não encontrado',
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Erro de validação',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                status: 'error',
                                message: 'Erro de validação',
                                errors: {
                                    email: ['Email inválido'],
                                    password: ['Senha deve ter pelo menos 8 caracteres'],
                                },
                            },
                        },
                    },
                },
                ServerError: {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                            example: {
                                status: 'error',
                                message: 'Algo deu errado. Por favor, tente novamente mais tarde.',
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/docs/*.yaml'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
/**
 * Configura o Swagger na aplicação
 */
const setupSwagger = (app) => {
    // Rota para a documentação Swagger
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Rota para o JSON da especificação Swagger
    app.get('/api/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(`Documentação Swagger disponível em /api/docs`);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.utils.js.map