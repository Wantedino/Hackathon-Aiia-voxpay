import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbAll } from '../config/database.js';

const router = express.Router();

// Listar investimentos
router.get('/', authenticate, async (req, res) => {
  try {
    const investments = await dbAll(
      'SELECT * FROM investments WHERE user_id = ?',
      [req.userId]
    );
    res.json({ investments });
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    res.status(500).json({ error: 'Erro ao buscar investimentos' });
  }
});

export default router;
