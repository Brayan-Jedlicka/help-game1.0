import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './src/database.js';
import authRoutes from './src/routes/auth.js';
import usersRoutes from './src/routes/users.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de registro, tente novamente em uma hora',
  skipSuccessfulRequests: true
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: false
});
app.use('/api', generalLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth/login', loginLimiter);
initializeDatabase();
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});
app.listen(PORT, () => {
  console.log(`🎮 Servidor Help Game rodando em http://localhost:${PORT}`);
  console.log(`📧 Confirmação de email ativada`);
  console.log(`🔒 Proteção de segurança ativada (helmet, rate-limit, compression)`);
});

