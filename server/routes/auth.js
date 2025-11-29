import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { dbRun, dbGet } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Registro de usuário
router.post('/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Verifica se usuário já existe
      const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Cria usuário
      await dbRun(
        'INSERT INTO users (id, name, email, password, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, name, email, hashedPassword, 5500.00, new Date().toISOString()]
      );

      // Gera token
      const token = jwt.sign({ userId, email, name }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: userId,
          name,
          email,
          balance: 5500.00,
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Busca usuário
      const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gera token
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          balance: user.balance,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

export default router;
