# Como Rodar o Projeto em Outro Computador

## Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

## Passos para Instalação

### 1. Clone ou copie o projeto
```bash
# Se estiver no Git
git clone <url-do-repositorio>
cd hackathonvs

# Ou apenas copie a pasta do projeto
```

### 2. Instale as dependências do cliente (frontend)
```bash
npm install
```

### 3. Instale as dependências do servidor (backend)
```bash
cd server
npm install
cd ..
```

### 4. Configure o banco de dados
```bash
cd server
npm run init-db
npm run seed-db
cd ..
```

### 5. Inicie o projeto

**Opção A - Dois terminais separados:**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
npm run dev
```

**Opção B - Um único comando (se tiver concorrently instalado):**
```bash
npm install -g concurrently
concurrently "cd server && npm start" "npm run dev"
```

### 6. Acesse o aplicativo
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Observações
- Certifique-se de que as portas 3000 e 5173 estejam livres
- O backend deve estar rodando antes de usar todas as funcionalidades do app
- Os dados do banco são armazenados em `server/voxpay.db`

---

# Tecnologias Utilizadas

## Frontend
- **React** 18.2.0 - Biblioteca JavaScript para construção de interfaces
- **Vite** 5.0.8 - Build tool e dev server rápido
- **Tailwind CSS** 3.3.6 - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **Supabase Client** - Cliente JavaScript para Supabase
- **PostCSS** - Processador CSS
- **Autoprefixer** - Plugin PostCSS para adicionar prefixos CSS

## Backend
- **Node.js** - Runtime JavaScript
- **Express** 4.18.2 - Framework web para Node.js
- **SQLite3** 5.1.6 - Banco de dados SQL leve
- **JWT (jsonwebtoken)** 9.0.2 - Autenticação via tokens
- **bcryptjs** 2.4.3 - Criptografia de senhas
- **CORS** 2.8.5 - Habilitação de Cross-Origin Resource Sharing
- **dotenv** 16.3.1 - Gerenciamento de variáveis de ambiente
- **Helmet** 7.1.0 - Segurança HTTP headers
- **express-validator** 7.0.1 - Validação de dados
- **UUID** 9.0.1 - Geração de IDs únicos

## Ferramentas de Desenvolvimento
- **Nodemon** - Auto-reload do servidor durante desenvolvimento
- **ESM (ES Modules)** - Sistema de módulos moderno

## Arquitetura
- **SPA (Single Page Application)** - Aplicação de página única
- **REST API** - API RESTful para comunicação cliente-servidor
- **JWT Authentication** - Autenticação baseada em tokens
- **SQLite Database** - Banco de dados relacional local
