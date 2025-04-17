import express, { Application, Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import Database from './config/database';
import { errorHandler } from './utils/error.utils';
import { setupSwagger } from './utils/swagger.utils';
import {
  verifyToken,
  securityMiddleware,
  validate,
  authenticate,
  authorize
} from './middlewares';

import {
  authRoutes,
  userRoutes,
  accountRoutes,
  transactionRoutes,
  profileRoutes,
  transactionReportRoutes
} from './routes';

/**
 * Classe principal da aplicação
 */
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureSwagger();
    this.configureErrorHandling();
  }

  /**
   * Configura os middlewares da aplicação
   */
  private configureMiddlewares(): void {
    // Segurança básica
    this.app.use(helmet());
    this.app.use(securityMiddleware.securityHeaders.bind(securityMiddleware));
    
    // CORS
    this.app.use(cors());
    
    // Logging
    if (config.env === 'development') {
      this.app.use(morgan('dev'));
    }
    
    // Limitação de taxa - 100 requisições por 15 minutos
    const rateLimit = require('express-rate-limit');
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    }));
    
    // Validação e sanitização
    this.app.use(securityMiddleware.validateContentType.bind(securityMiddleware));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(securityMiddleware.preventNoSql.bind(securityMiddleware));
    this.app.use(securityMiddleware.sanitizeData.bind(securityMiddleware));
  }

  /**
   * Configura as rotas da aplicação
   */
  private configureRoutes(): void {
    // Rota de saúde da API
    this.app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'API está funcionando corretamente',
        timestamp: new Date().toISOString(),
        environment: config.env,
      });
    });

    // Rotas da API
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/profile', profileRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/accounts', accountRoutes);
    this.app.use('/api/transactions', transactionRoutes);
    this.app.use('/api/reports', transactionReportRoutes);
  }

  /**
   * Configura o Swagger para documentação da API
   */
  private configureSwagger(): void {
    setupSwagger(this.app as unknown as Express);
  }

  /**
   * Configura o tratamento de erros
   */
  private configureErrorHandling(): void {
    // Middleware para rotas não encontradas
    this.app.use((req, res, next) => {
      const err = new Error(`Rota não encontrada - ${req.originalUrl}`);
      res.status(404);
      next(err);
    });
    
    // Middleware para tratamento global de erros
    this.app.use(errorHandler);
  }

  /**
   * Inicia o servidor
   */
  public async start(): Promise<void> {
    try {
      // Conecta ao banco de dados
      await Database.connect();
      
      // Inicia o servidor
      this.app.listen(config.port, () => {
        // Use debug logs in production instead of console.log
        if (config.env === 'development') {
          console.log(`Servidor rodando na porta ${config.port} em modo ${config.env}`);
          console.log(`Documentação Swagger disponível em http://localhost:${config.port}/api/docs`);
        }
      });
    } catch (error) {
      if (config.env === 'development') {
        console.error('Erro ao iniciar o servidor:', error);
      }
      process.exit(1);
    }
  }
}

export default App;