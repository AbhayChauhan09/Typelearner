import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// --- HEALTH CHECK ROUTE (ALB isko check karega) ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TypeLearner API is running' });
});

// --- API ROUTES ---
const apiRouter = express.Router();

// Register Route
apiRouter.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password_hash]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login Route
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', username: result.rows[0].username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use('/api', apiRouter); 

// --- DATABASE POOL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || 'postgres')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'typing_app'}`,
});

// --- DB INITIALIZATION ---
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
    `);
  } finally {
    client.release();
  }
}

// --- SERVER STARTUP ---
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

  const server = app.listen(port, '0.0.0.0', () => 
    console.log(`TypeLearner API is running on port ${port}`)
  );

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    server.close(() => { pool.end(); });
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});