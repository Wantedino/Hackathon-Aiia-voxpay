import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { dbAll, dbRun, dbGet } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Listar transações
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 50, offset = 0, type, category } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [req.userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const transactions = await dbAll(query, params);

    res.json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Criar transação
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, amount, type, category, description } = req.body;

    const transactionId = uuidv4();
    const date = new Date().toISOString();

    await dbRun(
      `INSERT INTO transactions (id, user_id, title, amount, type, category, description, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, req.userId, title, amount, type, category, description || null, date]
    );

    // Atualiza saldo do usuário
    const user = await dbGet('SELECT balance FROM users WHERE id = ?', [req.userId]);
    const newBalance = user.balance + amount;
    
    await dbRun('UPDATE users SET balance = ? WHERE id = ?', [newBalance, req.userId]);

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction: {
        id: transactionId,
        title,
        amount,
        type,
        category,
        date,
      },
      newBalance,
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// Obter estatísticas
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calcula período
    const now = new Date();
    let startDate;
    
    if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    const stats = await dbGet(
      `SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN ABS(amount) ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
       FROM transactions 
       WHERE user_id = ? AND date >= ?`,
      [req.userId, startDate.toISOString()]
    );

    res.json({ stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;
