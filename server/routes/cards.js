import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbAll } from '../config/database.js';

const router = express.Router();

// Listar cartões
router.get('/', authenticate, async (req, res) => {
  try {
    const cards = await dbAll(
      'SELECT * FROM cards WHERE user_id = ? ORDER BY is_primary DESC',
      [req.userId]
    );
    res.json({ cards });
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
    res.status(500).json({ error: 'Erro ao buscar cartões' });
  }
});

export default router;
