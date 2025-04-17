/**
 * Classe responsável por gerenciar a conexão com o MongoDB
 */
declare class Database {
    /**
     * Inicializa a conexão com o MongoDB
     */
    static connect(): Promise<void>;
    /**
     * Fecha a conexão com o MongoDB
     */
    static disconnect(): Promise<void>;
}
export default Database;
