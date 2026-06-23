import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- HEALTH CHECK ROUTE (Added for AWS ALB) ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TypeLearner API is running' });
});
// ----------------------------------------------

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || 'postgres')}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'typing_app'}`,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        token TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER NOT NULL,
        completed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, lesson_id)
      );
    `);
  } finally {
    client.release();
  }
}

// Routes (Yahan apne baki routes add karein, e.g., app.post('/register', ...))

async function start() {
  console.log("Starting server...");
  let connected = false;
  
  while (!connected) {
    try {
      await initDb();
      console.log('Database initialized successfully');
      connected = true;
    } catch (error) {
      console.error('Waiting for DB to be ready... Retrying in 5s', error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  app.listen(port, '0.0.0.0', () => 
    console.log(`TypeLearner API is running on port ${port}`)
  );
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});