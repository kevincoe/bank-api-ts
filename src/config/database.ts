import mongoose from 'mongoose';
import config from '../config/config';

/**
 * Classe responsável por gerenciar a conexão com o MongoDB
 */
class Database {
  /**
   * Inicializa a conexão com o MongoDB
   */
  public static async connect(): Promise<void> {
    try {
      const options = {
        autoIndex: true,
      };

      await mongoose.connect(config.mongoUri);
      
      console.log('Conexão com o MongoDB estabelecida com sucesso');
      
      mongoose.connection.on('error', (err) => {
        console.error(`Erro na conexão com o MongoDB: ${err}`);
      });
      
    } catch (error) {
      console.error('Não foi possível conectar ao MongoDB:', error);
      process.exit(1);
    }
  }

  /**
   * Fecha a conexão com o MongoDB
   */
  public static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Conexão com o MongoDB fechada com sucesso');
    } catch (error) {
      console.error('Erro ao fechar a conexão com o MongoDB:', error);
    }
  }
}

export default Database;
