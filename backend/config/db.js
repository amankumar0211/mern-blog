const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306),
      ssl: {
        rejectUnauthorized: false
        },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await pool.query('SELECT 1');

    console.log('MySQL connected successfully!');
    return pool;
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    process.exit(1);
  }
};

// Allows controllers to execute SQL queries
connectDB.query = (...args) => {
  if (!pool) throw new Error('Database is not connected');
  return pool.query(...args);
};

module.exports = connectDB;