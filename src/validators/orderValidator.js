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

const createOrderValidator = [
  body('username')
    .isString()
    .withMessage('Имя обязательно')
    .trim()
    .notEmpty()
    .withMessage('Имя обязательно')
    .isLength({ max: 100 })
    .withMessage('Имя слишком длинное'),
  body('phoneNumber')
    .isString()
    .withMessage('Телефон обязателен')
    .trim()
    .notEmpty()
    .withMessage('Телефон обязателен')
    .isLength({ min: 6, max: 20 })
    .withMessage('Некорректный номер телефона'),
  body('description')
    .optional()
    .isString()
    .withMessage('Описание должно быть строкой')
    .isLength({ max: 1000 })
    .withMessage('Описание слишком длинное'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Примечание должно быть строкой')
    .isLength({ max: 1000 })
    .withMessage('Примечание слишком длинное'),
  body('product')
    .isObject()
    .withMessage('Информация о товаре обязательна'),
  body('product.productName')
    .isString()
    .withMessage('Название товара обязательно')
    .trim()
    .notEmpty()
    .withMessage('Название товара обязательно')
    .isLength({ max: 200 })
    .withMessage('Название товара слишком длинное'),
  body('product.price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Цена товара должна быть положительным числом'),
  body('product.quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Количество должно быть от 1 до 1000'),
  handleValidation,
];

const updateOrderStatusValidator = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Некорректный статус заказа'),
  handleValidation,
];

const updatePaymentStatusValidator = [
  body('paymentStatus')
    .isIn(['unpaid', 'paid', 'refunded'])
    .withMessage('Некорректный статус оплаты'),
  handleValidation,
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator,
  handleValidation,
};
