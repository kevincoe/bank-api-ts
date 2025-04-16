import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bank-api',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export default config;
