import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../database/voxpay.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Populando banco de dados com dados de exemplo...\n');

const userId = uuidv4();
const hashedPassword = await bcrypt.hash('123456', 10);

db.serialize(() => {
  // Criar usuário de exemplo
  db.run(
    'INSERT INTO users (id, name, email, password, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, 'Erick Mendonça', 'erick.mendonca@email.com', hashedPassword, 5500.00, new Date().toISOString()],
    (err) => {
      if (err) console.error('Erro ao criar usuário:', err);
      else console.log('✅ Usuário criado: erick.mendonca@email.com / senha: 123456');
    }
  );

  // Criar transações de exemplo
  const transactions = [
    { title: 'Salário', amount: 5500, type: 'income', category: 'salary', date: '2025-11-01T10:00:00' },
    { title: 'Mercado', amount: -250.80, type: 'expense', category: 'food', date: '2025-11-15T14:30:00' },
    { title: 'Uber', amount: -32.50, type: 'expense', category: 'transport', date: '2025-11-20T08:00:00' },
    { title: 'Freelance', amount: 800, type: 'income', category: 'other', date: '2025-11-22T16:00:00' },
    { title: 'Netflix', amount: -49.90, type: 'expense', category: 'entertainment', date: '2025-11-05T00:00:00' },
  ];

  transactions.forEach((t) => {
    db.run(
      'INSERT INTO transactions (id, user_id, title, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), userId, t.title, t.amount, t.type, t.category, t.date],
      (err) => {
        if (err) console.error('Erro ao criar transação:', err);
      }
    );
  });
  console.log('✅ Transações criadas');

  // Criar metas de exemplo
  const goals = [
    { title: 'Fundo de Emergência', target: 10000, current: 4500, icon: 'shield' },
    { title: 'Viagem Europa', target: 15000, current: 8200, icon: 'plane' },
  ];

  goals.forEach((g) => {
    db.run(
      'INSERT INTO goals (id, user_id, title, target, current, icon, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), userId, g.title, g.target, g.current, g.icon, new Date().toISOString()],
      (err) => {
        if (err) console.error('Erro ao criar meta:', err);
      }
    );
  });
  console.log('✅ Metas criadas');

  // Criar notificações de exemplo
  const notifications = [
    { title: 'Pagamento recebido', message: 'Você recebeu R$ 5.500,00', read: 0 },
    { title: 'Meta atingida!', message: 'Parabéns! Você atingiu 80% da meta Viagem Europa', read: 0 },
    { title: 'Cashback disponível', message: 'R$ 125,50 em cashback para resgatar', read: 0 },
  ];

  notifications.forEach((n) => {
    db.run(
      'INSERT INTO notifications (id, user_id, title, message, read, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), userId, n.title, n.message, n.read, new Date().toISOString()],
      (err) => {
        if (err) console.error('Erro ao criar notificação:', err);
      }
    );
  });
  console.log('✅ Notificações criadas');

  console.log('\n🎉 Banco de dados populado com sucesso!');
  console.log('\n📧 Email: erick.mendonca@email.com');
  console.log('🔑 Senha: 123456\n');
});

db.close();
