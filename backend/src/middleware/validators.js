import { body, query, validationResult } from 'express-validator';
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validação falhou',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};
export const validateRegister = [
  body('fullname')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome completo deve ter no mínimo 3 caracteres'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username deve ter entre 3 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username pode conter apenas letras, números e underscore'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter no mínimo 8 caracteres')
    .matches(/[a-zA-Z]/)
    .withMessage('Senha deve conter letras')
    .matches(/[0-9]/)
    .withMessage('Senha deve conter números')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Senha deve conter símbolos'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role inválido'),
  handleValidationErrors
];
// Validadores para LOGIN
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  handleValidationErrors
];
// Validadores para VERIFY EMAIL
export const validateVerifyEmail = [
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Token de verificação é obrigatório')
    .isUUID()
    .withMessage('Token inválido'),
  handleValidationErrors
];
// Validadores para RESEND VERIFICATION
export const validateResendVerification = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  handleValidationErrors
];

