import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TypeLearner API is running' });
});

 
const apiRouter = express.Router();

apiRouter.post('/auth/login', async (req, res) => {
  // Yahan apna Login logic likhein
  res.status(200).json({ message: "Login logic here" });
});

apiRouter.post('/auth/register', async (req, res) => {
  // Yahan apna Register logic likhein
  res.status(200).json({ message: "Register logic here" });
});


app.use('/api', apiRouter); 
// --------------------------------------------------

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || 'postgres')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'typing_app'}`,
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