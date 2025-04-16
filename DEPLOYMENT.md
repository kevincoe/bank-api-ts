# Instruções de Implantação - Bank API

Este documento contém instruções detalhadas para implantar a API bancária em diferentes ambientes.

## Pré-requisitos

- Node.js 18.x ou superior
- MongoDB 6.0 ou superior
- Git

## Configuração do Ambiente

Antes de implantar a aplicação, você precisa configurar as variáveis de ambiente. Crie um arquivo `.env` baseado no arquivo `.env.example` fornecido:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://seu-servidor-mongodb:27017/bank-api
JWT_SECRET=seu_jwt_secret_seguro_para_producao
JWT_EXPIRES_IN=1d
```

> **IMPORTANTE**: Certifique-se de usar um JWT_SECRET forte e único para o ambiente de produção.

## Opções de Implantação

### 1. Implantação Manual em Servidor

#### Passos para Implantação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/bank-api.git
   cd bank-api
   ```

2. Instale as dependências:
   ```bash
   npm ci
   ```

3. Construa a aplicação:
   ```bash
   npm run build
   ```

4. Configure o arquivo `.env` com as variáveis de ambiente apropriadas.

5. Inicie a aplicação:
   ```bash
   npm start
   ```

#### Usando PM2 (Recomendado para Produção)

Para manter a aplicação em execução e gerenciar processos:

1. Instale o PM2 globalmente:
   ```bash
   npm install -g pm2
   ```

2. Inicie a aplicação com PM2:
   ```bash
   pm2 start dist/index.js --name "bank-api"
   ```

3. Configure o PM2 para iniciar automaticamente após reinicialização do servidor:
   ```bash
   pm2 startup
   pm2 save
   ```

4. Comandos úteis do PM2:
   ```bash
   pm2 status                # Verificar status
   pm2 logs bank-api         # Ver logs
   pm2 restart bank-api      # Reiniciar aplicação
   pm2 stop bank-api         # Parar aplicação
   ```

### 2. Implantação com Docker

#### Usando Docker Compose

1. Crie um arquivo `Dockerfile` na raiz do projeto:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

2. Crie um arquivo `docker-compose.yml`:
```yaml
version: '3'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/bank-api
      - JWT_SECRET=seu_jwt_secret_seguro
      - JWT_EXPIRES_IN=1d
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: always

volumes:
  mongo-data:
```

3. Inicie os contêineres:
```bash
docker-compose up -d
```

### 3. Implantação em Plataformas de Nuvem

#### Heroku

1. Instale a CLI do Heroku e faça login:
```bash
npm install -g heroku
heroku login
```

2. Crie uma aplicação Heroku:
```bash
heroku create sua-bank-api
```

3. Adicione um add-on do MongoDB:
```bash
heroku addons:create mongodb:sandbox
```

4. Configure as variáveis de ambiente:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu_jwt_secret_seguro
heroku config:set JWT_EXPIRES_IN=1d
```

5. Implante a aplicação:
```bash
git push heroku main
```

#### AWS Elastic Beanstalk

1. Instale a CLI do EB:
```bash
pip install awsebcli
```

2. Inicialize a configuração do EB:
```bash
eb init
```

3. Crie um ambiente:
```bash
eb create bank-api-production
```

4. Configure as variáveis de ambiente:
```bash
eb setenv NODE_ENV=production JWT_SECRET=seu_jwt_secret_seguro JWT_EXPIRES_IN=1d
```

5. Implante a aplicação:
```bash
eb deploy
```

## Verificação da Implantação

Após a implantação, verifique se a API está funcionando corretamente:

1. Acesse a rota de saúde da API:
```
GET /api/health
```

2. Verifique a documentação Swagger:
```
GET /api/docs
```

## Monitoramento e Logs

### Monitoramento Básico

- Use o PM2 para monitoramento básico: `pm2 monit`
- Configure alertas de uso de CPU e memória

### Logs

- Logs da aplicação: `pm2 logs bank-api`
- Em produção, considere usar um serviço de agregação de logs como ELK Stack, Graylog ou Datadog

## Backup do Banco de Dados

Configure backups regulares do MongoDB:

```bash
mongodump --uri="mongodb://seu-servidor:27017/bank-api" --out=/path/to/backup/$(date +"%Y-%m-%d")
```

Automatize este processo usando cron jobs.

## Atualizações e Rollbacks

### Atualizações

1. Faça pull das alterações mais recentes:
```bash
git pull origin main
```

2. Instale dependências e reconstrua:
```bash
npm ci
npm run build
```

3. Reinicie a aplicação:
```bash
pm2 restart bank-api
```

### Rollbacks

1. Reverta para uma versão anterior:
```bash
git checkout <commit-hash>
```

2. Reconstrua e reinicie:
```bash
npm ci
npm run build
pm2 restart bank-api
```

## Considerações de Segurança

- Mantenha o Node.js e todas as dependências atualizadas
- Use HTTPS em produção
- Implemente rate limiting para prevenir ataques de força bruta
- Configure firewalls para restringir o acesso ao servidor
- Realize auditorias de segurança regularmente

## Suporte e Solução de Problemas

Para problemas comuns:

1. Verifique os logs da aplicação
2. Verifique a conectividade com o MongoDB
3. Verifique as configurações de ambiente
4. Consulte a documentação da API

Para suporte adicional, entre em contato com a equipe de desenvolvimento.
