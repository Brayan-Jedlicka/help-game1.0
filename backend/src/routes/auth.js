import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { dbRun, dbGet } from '../database.js';
import { sendVerificationEmail } from '../email.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendVerification
} from '../middleware/validators.js';
const router = express.Router();
const VERIFICATION_EXPIRY_MS = 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { fullname, username, email, password, role } = req.body;
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email.toLowerCase(), username.toLowerCase()]
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Este email ou username já está em uso. Tente outro.'
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const verificationExpires = Date.now() + VERIFICATION_EXPIRY_MS;
    const userId = uuidv4();
    await dbRun(
      `INSERT INTO users (id, username, email, fullname, password, role, verification_token, verification_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, username.toLowerCase(), email.toLowerCase(), fullname, passwordHash, role || 'user', verificationToken, verificationExpires]
    );
    try {
      await sendVerificationEmail(email, fullname, verificationToken);
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
    }
    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso! Verifique seu email para confirmar.',
      user: {
        id: userId,
        username,
        email,
        fullname,
        role: role || 'user'
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    next(error);
  }
});
router.get('/verify-email', validateVerifyEmail, async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await dbGet(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Link de verificação inválido ou expirado.'
      });
    }
    if (user.verification_expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Link de verificação expirou. Solicite um novo.'
      });
    }
    await dbRun(
      'UPDATE users SET verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?',
      [user.id]
    );
    res.json({
      success: true,
      message: 'Email confirmado com sucesso! A sua conta está ativa.'
    });
  } catch (error) {
    console.error('Erro na verificação de email:', error);
    next(error);
  }
});
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await dbGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.'
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Email não confirmado. Verifique seu email para ativar a conta.',
        requiresEmailVerification: true
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.'
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    next(error);
  }
});
router.post('/resend-verification', validateResendVerification, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await dbGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado ou email inválido.'
      });
    }
    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Este email já foi confirmado.'
      });
    }
    const verificationToken = uuidv4();
    const verificationExpires = Date.now() + VERIFICATION_EXPIRY_MS;
    await dbRun(
      'UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?',
      [verificationToken, verificationExpires, user.id]
    );
    try {
      await sendVerificationEmail(user.email, user.fullname, verificationToken);
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
    }
    res.json({
      success: true,
      message: 'Email de verificação reenviado com sucesso. Verifique sua caixa de entrada.'
    });
  } catch (error) {
    console.error('Erro ao reenviar verificação:', error);
    next(error);
  }
});
export default router;

