import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbAll, dbRun, dbGet } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Listar metas
router.get('/', authenticate, async (req, res) => {
  try {
    const goals = await dbAll(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ goals });
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    res.status(500).json({ error: 'Erro ao buscar metas' });
  }
});

// Criar meta
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, target, current = 0, icon } = req.body;

    const goalId = uuidv4();
    const createdAt = new Date().toISOString();

    await dbRun(
      `INSERT INTO goals (id, user_id, title, target, current, icon, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [goalId, req.userId, title, target, current, icon || 'target', createdAt]
    );

    res.status(201).json({
      message: 'Meta criada com sucesso',
      goal: {
        id: goalId,
        title,
        target,
        current,
        icon,
      },
    });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({ error: 'Erro ao criar meta' });
  }
});

// Atualizar progresso da meta
router.put('/:id/progress', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await dbGet(
      'SELECT * FROM goals WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (!goal) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    const newCurrent = goal.current + amount;

    await dbRun(
      'UPDATE goals SET current = ? WHERE id = ?',
      [newCurrent, id]
    );

    res.json({
      message: 'Progresso atualizado',
      current: newCurrent,
      target: goal.target,
      percentage: (newCurrent / goal.target) * 100,
    });
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    res.status(500).json({ error: 'Erro ao atualizar meta' });
  }
});

// Deletar meta
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'DELETE FROM goals WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    res.json({ message: 'Meta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    res.status(500).json({ error: 'Erro ao deletar meta' });
  }
});

export default router;
