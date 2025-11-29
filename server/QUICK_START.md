# 🚀 Guia de Instalação Rápida - Backend VOXPAY

## Passo a Passo

### 1. Navegue até a pasta do servidor
```bash
cd server
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicialize o banco de dados
```bash
npm run init-db
```

### 4. Inicie o servidor
```bash
# Modo desenvolvimento (recomendado)
npm run dev

# OU modo produção
npm start
```

### 5. Teste a API
Abra o navegador em: `http://localhost:3000/health`

Você deve ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "VOXPAY API",
  "version": "1.0.0"
}
```

## ✅ Pronto!

O backend está rodando em `http://localhost:3000`

### Próximos passos:

1. **Teste os endpoints** usando Postman, Insomnia ou Thunder Client
2. **Integre com o frontend** usando o arquivo `src/services/api.js`
3. **Crie um usuário** via POST `/api/v1/auth/register`

## 📝 Exemplo de Teste

### Registrar usuário:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Erick Mendonça",
    "email": "erick@email.com",
    "password": "senha123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "erick@email.com",
    "password": "senha123"
  }'
```

## 🔧 Problemas?

- **Porta em uso?** Mude a porta no arquivo `.env`
- **Erro de dependências?** Delete `node_modules` e rode `npm install` novamente
- **Banco não cria?** Verifique permissões da pasta `database/`

## 📚 Documentação Completa

Veja `README.md` para documentação completa da API.
