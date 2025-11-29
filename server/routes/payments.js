import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbRun, dbGet } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Processar pagamento
router.post('/process', authenticate, async (req, res) => {
  try {
    const { description, amount, barcode, dueDate } = req.body;

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
      [transactionId, req.userId, description, -amount, 'expense', 'bills', `Vencimento: ${dueDate}`, date]
    );

    // Atualiza saldo
    const newBalance = user.balance - amount;
    await dbRun('UPDATE users SET balance = ? WHERE id = ?', [newBalance, req.userId]);

    res.json({
      message: 'Pagamento realizado com sucesso',
      transactionId,
      newBalance,
      receipt: {
        description,
        amount,
        date,
        barcode,
      },
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

export default router;
