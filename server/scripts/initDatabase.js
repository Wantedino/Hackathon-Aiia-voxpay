import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbDir = join(__dirname, '../database');
const dbPath = join(dbDir, 'voxpay.db');

// Cria diretório se não existir
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

console.log('🔧 Inicializando banco de dados...\n');

db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      balance REAL DEFAULT 0,
      avatar TEXT,
      created_at TEXT NOT NULL
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela users:', err);
    else console.log('✅ Tabela users criada');
  });

  // Tabela de transações
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela transactions:', err);
    else console.log('✅ Tabela transactions criada');
  });

  // Tabela de metas
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      target REAL NOT NULL,
      current REAL DEFAULT 0,
      icon TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela goals:', err);
    else console.log('✅ Tabela goals criada');
  });

  // Tabela de cartões
  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      last_digits TEXT NOT NULL,
      brand TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela cards:', err);
    else console.log('✅ Tabela cards criada');
  });

  // Tabela de investimentos
  db.run(`
    CREATE TABLE IF NOT EXISTS investments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      profitability REAL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela investments:', err);
    else console.log('✅ Tabela investments criada');
  });

  // Tabela de notificações
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela notifications:', err);
    else console.log('✅ Tabela notifications criada');
  });

  console.log('\n🎉 Banco de dados inicializado com sucesso!');
  console.log(`📁 Local: ${dbPath}\n`);
});

db.close();
