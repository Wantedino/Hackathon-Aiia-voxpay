# VOXPAY Backend API

Backend RESTful API para o aplicativo financeiro VOXPAY.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 📦 Instalação

1. Entre na pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

3. Inicialize o banco de dados:
```bash
npm run init-db
```

4. Inicie o servidor:
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação

#### POST `/api/v1/auth/register`
Registrar novo usuário
```json
{
  "name": "Erick Mendonça",
  "email": "erick@email.com",
  "password": "senha123"
}
```

#### POST `/api/v1/auth/login`
Login de usuário
```json
{
  "email": "erick@email.com",
  "password": "senha123"
}
```

### Usuários (Requer autenticação)

#### GET `/api/v1/users/profile`
Obter perfil do usuário

#### PUT `/api/v1/users/profile`
Atualizar perfil
```json
{
  "name": "Novo Nome",
  "avatar": "url_avatar"
}
```

#### GET `/api/v1/users/balance`
Obter saldo atual

### Transações (Requer autenticação)

#### GET `/api/v1/transactions`
Listar transações
- Query params: `limit`, `offset`, `type`, `category`

#### POST `/api/v1/transactions`
Criar transação
```json
{
  "title": "Salário",
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "description": "Salário mensal"
}
```

#### GET `/api/v1/transactions/stats`
Estatísticas de transações
- Query params: `period` (week, month, year)

### Metas (Requer autenticação)

#### GET `/api/v1/goals`
Listar metas

#### POST `/api/v1/goals`
Criar meta
```json
{
  "title": "Viagem",
  "target": 5000,
  "current": 0,
  "icon": "plane"
}
```

#### PUT `/api/v1/goals/:id/progress`
Atualizar progresso
```json
{
  "amount": 500
}
```

#### DELETE `/api/v1/goals/:id`
Deletar meta

### PIX (Requer autenticação)

#### POST `/api/v1/pix/send`
Enviar PIX
```json
{
  "recipient": "joao@email.com",
  "amount": 100,
  "message": "Almoço"
}
```

#### POST `/api/v1/pix/receive`
Receber PIX
```json
{
  "sender": "maria@email.com",
  "amount": 50
}
```

### Pagamentos (Requer autenticação)

#### POST `/api/v1/payments/process`
Processar pagamento de conta
```json
{
  "description": "Conta de Luz",
  "amount": 150,
  "barcode": "12345678901234567890123456789012345678901234567",
  "dueDate": "2025-11-30"
}
```

### Criptomoedas

#### GET `/api/v1/crypto`
Listar criptomoedas (não requer autenticação)

### Notificações (Requer autenticação)

#### GET `/api/v1/notifications`
Listar notificações

#### PUT `/api/v1/notifications/:id/read`
Marcar como lida

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer seu_token_aqui
```

O token é retornado nos endpoints de registro e login.

## 🗄️ Estrutura do Banco de Dados

### Tabelas:
- **users** - Dados dos usuários
- **transactions** - Histórico de transações
- **goals** - Metas financeiras
- **cards** - Cartões do usuário
- **investments** - Investimentos
- **notifications** - Notificações

## 🌐 Variáveis de Ambiente

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui
DB_PATH=./database/voxpay.db
CORS_ORIGIN=http://localhost:5500
API_VERSION=v1
```

## 📝 Resposta de Erro Padrão

```json
{
  "error": "Mensagem de erro"
}
```

## 🔍 Health Check

```
GET /health
```

Retorna:
```json
{
  "status": "ok",
  "timestamp": "2025-11-27T...",
  "service": "VOXPAY API",
  "version": "1.0.0"
}
```

## 👨‍💻 Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📄 Licença

MIT
