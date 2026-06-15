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

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors());
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
      email TEXT,
      password_hash TEXT NOT NULL,
      token TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS token TEXT');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    );
  `);

  await pool.query('ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW()');

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key') THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
      END IF;
    END $$;
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_key') THEN
        ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
      END IF;
    END $$;
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

    const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ ok: false, message: 'This email or username already exists.' });
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
    res.status(500).json({ ok: false, message: 'Unable to register user right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = result.rows[0];

    if (!user) return authError(res, 'Invalid email or password');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return authError(res, 'Invalid email or password');

    const token = crypto.randomUUID();
    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);

    res.json({ ok: true, token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('login error', error);
    res.status(500).json({ ok: false, message: 'Unable to login right now.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const user = await getUserFromToken(req, res);
  if (!user) return authError(res);

  res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/progress/me', async (req, res) => {
  const user = await getUserFromToken(req, res);
  if (!user) return authError(res);

  const result = await pool.query('SELECT lesson_id FROM user_progress WHERE user_id = $1 ORDER BY lesson_id', [user.id]);
  const completedLessons = result.rows.map((row) => row.lesson_id);
  const highest = completedLessons.length ? Math.max(...completedLessons) : 0;
  const unlockedLesson = Math.min(12, highest + 1);

  res.json({ ok: true, completedLessons, unlockedLesson });
});

app.post('/api/progress/complete-lesson', async (req, res) => {
  const user = await getUserFromToken(req, res);
  if (!user) return authError(res);

  const { lessonId } = req.body || {};
  const lesson = Number(lessonId);

  if (!Number.isInteger(lesson) || lesson < 1) {
    return res.status(400).json({ ok: false, message: 'A valid lesson number is required.' });
  }

  try {
    await pool.query(
      'INSERT INTO user_progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT (user_id, lesson_id) DO NOTHING',
      [user.id, lesson]
    );

    const result = await pool.query('SELECT lesson_id FROM user_progress WHERE user_id = $1 ORDER BY lesson_id', [user.id]);
    const completedLessons = result.rows.map((row) => row.lesson_id);
    const highest = completedLessons.length ? Math.max(...completedLessons) : 0;

    res.json({ ok: true, completedLessons, unlockedLesson: Math.min(12, highest + 1) });
  } catch (error) {
    console.error('complete lesson error', error);
    res.status(500).json({ ok: false, message: 'Could not save lesson completion.' });
  }
});

async function start() {
  await initDb();
  app.listen(port, () => console.log(`TypeLearner API running on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
