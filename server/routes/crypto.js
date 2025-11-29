import express from 'express';

const router = express.Router();

// Listar criptomoedas (dados mockados ou de API externa)
router.get('/', async (req, res) => {
  try {
    const cryptoData = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 249850.50, change24h: 5.2 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 12450.80, change24h: 3.8 },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 2.35, change24h: -1.2 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 580.20, change24h: 8.5 },
    ];
    
    res.json({ cryptos: cryptoData });
  } catch (error) {
    console.error('Erro ao buscar criptomoedas:', error);
    res.status(500).json({ error: 'Erro ao buscar criptomoedas' });
  }
});

export default router;
