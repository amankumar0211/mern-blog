require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// ---------- Middleware ----------
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header), e.g. curl or health checks
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const err = new Error(`CORS: origin ${origin} is not allowed`);
      err.status = 403;
      return callback(err);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));

// ---------- Routes ----------
app.get('/', (req, res) => res.json({ message: 'MERN Blog API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/posts', postRoutes);

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start ----------
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
