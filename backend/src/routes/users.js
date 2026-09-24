import express from 'express';
import { dbGet, dbAll } from '../database.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await dbGet(
      'SELECT id, username, email, fullname, role, verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }
    const users = await dbAll(
      'SELECT id, username, email, fullname, role, verified, created_at FROM users'
    );
    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
});
export default router;

