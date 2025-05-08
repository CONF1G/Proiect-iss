const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const pool =require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());

// Create users table if not exists
async function initializeDB() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      mobile VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  await pool.query(createTableQuery);
}
initializeDB();

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    
    // Check if user exists
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?', 
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    await pool.query(
      'INSERT INTO users (username, email, password, mobile) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, mobile]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));