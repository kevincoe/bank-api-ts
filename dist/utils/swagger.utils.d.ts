import { Express } from 'express';
/**
 * Configuração do Swagger
 */
export declare const swaggerOptions: {
    definition: {
        openapi: string;
        info: {
            title: string;
            version: string;
            description: string;
            contact: {
                name: string;
                email: string;
            };
            license: {
                name: string;
                url: string;
            };
        };
        servers: {
            url: string;
            description: string;
        }[];
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: string;
                    scheme: string;
                    bearerFormat: string;
                };
            };
            schemas: {
                User: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        name: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        email: {
                            type: string;
                            description: string;
                            format: string;
                            example: string;
                        };
                        password: {
                            type: string;
                            description: string;
                            format: string;
                            example: string;
                        };
                        cpf: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        role: {
                            type: string;
                            description: string;
                            enum: string[];
                            example: string;
                        };
                        phone: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        address: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        isActive: {
                            type: string;
                            description: string;
                            example: boolean;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                    };
                };
                Account: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        accountNumber: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        type: {
                            type: string;
                            description: string;
                            enum: string[];
                            example: string;
                        };
                        balance: {
                            type: string;
                            description: string;
                            example: number;
                        };
                        user: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        isActive: {
                            type: string;
                            description: string;
                            example: boolean;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                    };
                };
                Transaction: {
                    type: string;
                    required: string[];
                    properties: {
                        id: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        type: {
                            type: string;
                            description: string;
                            enum: string[];
                            example: string;
                        };
                        amount: {
                            type: string;
                            description: string;
                            example: number;
                        };
                        sourceAccount: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        destinationAccount: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        description: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        status: {
                            type: string;
                            description: string;
                            enum: string[];
                            example: string;
                        };
                        createdAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                    };
                };
                Error: {
                    type: string;
                    properties: {
                        status: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        message: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        errors: {
                            type: string;
                            description: string;
                            example: {
                                email: string[];
                                password: string[];
                            };
                        };
                    };
                };
            };
            responses: {
                UnauthorizedError: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                status: string;
                                message: string;
                            };
                        };
                    };
                };
                NotFoundError: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                status: string;
                                message: string;
                            };
                        };
                    };
                };
                ValidationError: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                status: string;
                                message: string;
                                errors: {
                                    email: string[];
                                    password: string[];
                                };
                            };
                        };
                    };
                };
                ServerError: {
                    description: string;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                            example: {
                                status: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        security: {
            bearerAuth: never[];
        }[];
    };
    apis: string[];
};
/**
 * Configura o Swagger na aplicação
 */
export declare const setupSwagger: (app: Express) => void;
