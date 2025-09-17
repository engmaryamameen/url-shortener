import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { ensureRedisConnection } from './redis';
import { shortenRouter , redirectRouter, qrcodeRouter } from './routes';
import { globalLimiter, shortenLimiter } from './middleware';
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:5173',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', globalLimiter);

// API routes
app.use('/api', shortenRouter);
app.use('/', redirectRouter);
app.use('/api', qrcodeRouter);
// Stricter rate limiting for shorten endpoint
app.use('/api/shorten', shortenLimiter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await ensureRedisConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();