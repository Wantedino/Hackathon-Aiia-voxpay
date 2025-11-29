import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Rotas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import transactionRoutes from './routes/transactions.js';
import goalRoutes from './routes/goals.js';
import cardRoutes from './routes/cards.js';
import investmentRoutes from './routes/investments.js';
import cryptoRoutes from './routes/crypto.js';
import pixRoutes from './routes/pix.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';

// Configuração
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
  credentials: true,
}));

// Middlewares gerais
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VOXPAY API',
    version: '1.0.0',
  });
});

// Rotas da API
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/goals`, goalRoutes);
app.use(`${API_PREFIX}/cards`, cardRoutes);
app.use(`${API_PREFIX}/investments`, investmentRoutes);
app.use(`${API_PREFIX}/crypto`, cryptoRoutes);
app.use(`${API_PREFIX}/pix`, pixRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor VOXPAY rodando!
   
   📡 Porta: ${PORT}
   🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
   🔗 API Base: http://localhost:${PORT}${API_PREFIX}
   ❤️  Health: http://localhost:${PORT}/health
  `);
});

export default app;
