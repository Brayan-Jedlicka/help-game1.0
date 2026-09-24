import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/helpgame.db');
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Banco de dados SQLite conectado');
  }
});
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
export const initializeDatabase = async () => {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        fullname TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        verified BOOLEAN DEFAULT 0,
        verification_token TEXT UNIQUE,
        verification_expires INTEGER,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_email ON users(LOWER(email))`);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_username ON users(LOWER(username))`);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_verification_token ON users(verification_token)`);
    await dbRun(`CREATE INDEX IF NOT EXISTS idx_verified ON users(verified)`);
    console.log('✅ Tabelas do banco de dados criadas/verificadas');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
};
export default db;

