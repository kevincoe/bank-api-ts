import { Application } from 'express';
/**
 * Classe principal da aplicação
 */
declare class App {
    app: Application;
    constructor();
    /**
     * Configura os middlewares da aplicação
     */
    private configureMiddlewares;
    /**
     * Configura as rotas da aplicação
     */
    private configureRoutes;
    /**
     * Configura o Swagger para documentação da API
     */
    private configureSwagger;
    /**
     * Configura o tratamento de erros
     */
    private configureErrorHandling;
    /**
     * Inicia o servidor
     */
    start(): Promise<void>;
}
export default App;
