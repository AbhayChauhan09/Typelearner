import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 
dotenv.config();
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || 'postgres')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'typing_app'}`,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      token TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    );
  `);
}

function authError(res, message = 'Authentication required') {
  return res.status(401).json({ ok: false, message });
}

async function getUserFromToken(req, res) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token) return null;

  const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);
  return result.rows[0] || null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'TypeLearner API is online' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Username, email and password are required.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const token = crypto.randomUUID();

    const insert = await pool.query(
      'INSERT INTO users (username, email, password_hash, token) VALUES ($1, $2, $3, $4) RETURNING id, username, email, token',
      [username.trim(), email.trim().toLowerCase(), passwordHash, token]
    );

    res.json({ ok: true, token, user: insert.rows[0] });
  } catch (error) {
    console.error('register error', error);
    res.status(500).json({ ok: false, message: 'Unable to register user.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return authError(res, 'Invalid email or password');
    }

    const token = crypto.randomUUID();
    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);

    res.json({ ok: true, token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Unable to login.' });
  }
});

app.post('/api/progress/complete-lesson', async (req, res) => {
  const user = await getUserFromToken(req, res);
  if (!user) return authError(res);

  const { lessonId } = req.body || {};
  try {
    await pool.query(
      'INSERT INTO user_progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT (user_id, lesson_id) DO NOTHING',
      [user.id, Number(lessonId)]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Could not save progress.' });
  }
});

async function start() {
  await initDb();
  // Bound to 0.0.0.0 to be accessible outside the Docker container
  app.listen(port, '0.0.0.0', () => 
    console.log(`TypeLearner API is running on port ${port}`)
  );
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});