import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbAll, dbRun } from '../config/database.js';

const router = express.Router();

// Listar notificações
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await dbAll(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );
    res.json({ notifications });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

// Marcar como lida
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    await dbRun(
      'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
});

export default router;
