import App from './app';

/**
 * Função principal para iniciar a aplicação
 */
async function bootstrap() {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

// Inicia a aplicação
bootstrap();

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promessa rejeitada não tratada:', error);
  process.exit(1);
});
