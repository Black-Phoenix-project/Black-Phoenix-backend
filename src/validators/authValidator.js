const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const phoneNumber = () =>
  body('phoneNumber')
    .isString()
    .withMessage('Телефон обязателен')
    .trim()
    .notEmpty()
    .withMessage('Телефон обязателен')
    .isLength({ min: 6, max: 20 })
    .withMessage('Некорректный номер телефона');

const password = (field = 'password') =>
  body(field)
    .isString()
    .withMessage('Пароль обязателен')
    .notEmpty()
    .withMessage('Пароль обязателен')
    .isLength({ min: 6, max: 100 })
    .withMessage('Пароль должен содержать минимум 6 символов');

const loginPassword = (field = 'password') =>
  body(field)
    .isString()
    .withMessage('Пароль обязателен')
    .notEmpty()
    .withMessage('Пароль обязателен')
    .isLength({ max: 100 })
    .withMessage('Пароль слишком длинный');

const adminLoginValidator = [
  phoneNumber(),
  loginPassword(),
  handleValidation,
];

const adminRegisterValidator = [
  phoneNumber(),
  password(),
  body('fullName')
    .optional()
    .isString()
    .withMessage('Имя должно быть строкой')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Имя слишком длинное'),
  handleValidation,
];

const clientRegisterValidator = [
  phoneNumber(),
  password(),
  body('fullName')
    .optional()
    .isString()
    .withMessage('Имя должно быть строкой')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Имя слишком длинное'),
  handleValidation,
];

const clientLoginValidator = [
  phoneNumber(),
  loginPassword(),
  handleValidation,
];

module.exports = {
  adminLoginValidator,
  adminRegisterValidator,
  clientRegisterValidator,
  clientLoginValidator,
  handleValidation,
};
