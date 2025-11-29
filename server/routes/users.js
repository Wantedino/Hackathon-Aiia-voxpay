import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbGet, dbRun } from '../config/database.js';

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, name, email, balance, avatar, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Atualizar perfil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    await dbRun(
      'UPDATE users SET name = ?, avatar = ? WHERE id = ?',
      [name, avatar, req.userId]
    );

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Obter saldo
router.get('/balance', authenticate, async (req, res) => {
  try {
    const user = await dbGet('SELECT balance FROM users WHERE id = ?', [req.userId]);
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    res.status(500).json({ error: 'Erro ao buscar saldo' });
  }
});

export default router;
