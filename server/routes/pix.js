import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbRun, dbGet } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Enviar PIX
router.post('/send', authenticate, async (req, res) => {
  try {
    const { recipient, amount, message } = req.body;

    // Verifica saldo
    const user = await dbGet('SELECT balance FROM users WHERE id = ?', [req.userId]);
    
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    const transactionId = uuidv4();
    const date = new Date().toISOString();

    // Cria transação
    await dbRun(
      `INSERT INTO transactions (id, user_id, title, amount, type, category, description, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, req.userId, `PIX para ${recipient}`, -amount, 'expense', 'transfer', message, date]
    );

    // Atualiza saldo
    const newBalance = user.balance - amount;
    await dbRun('UPDATE users SET balance = ? WHERE id = ?', [newBalance, req.userId]);

    res.json({
      message: 'PIX enviado com sucesso',
      transactionId,
      newBalance,
    });
  } catch (error) {
    console.error('Erro ao enviar PIX:', error);
    res.status(500).json({ error: 'Erro ao enviar PIX' });
  }
});

// Receber PIX
router.post('/receive', authenticate, async (req, res) => {
  try {
    const { sender, amount } = req.body;

    const transactionId = uuidv4();
    const date = new Date().toISOString();

    // Cria transação
    await dbRun(
      `INSERT INTO transactions (id, user_id, title, amount, type, category, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, req.userId, `PIX de ${sender}`, amount, 'income', 'transfer', date]
    );

    // Atualiza saldo
    const user = await dbGet('SELECT balance FROM users WHERE id = ?', [req.userId]);
    const newBalance = user.balance + amount;
    await dbRun('UPDATE users SET balance = ? WHERE id = ?', [newBalance, req.userId]);

    res.json({
      message: 'PIX recebido com sucesso',
      transactionId,
      newBalance,
    });
  } catch (error) {
    console.error('Erro ao receber PIX:', error);
    res.status(500).json({ error: 'Erro ao receber PIX' });
  }
});

export default router;
