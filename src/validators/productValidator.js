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

const imageChain = () => {
  const field = body('image').optional();
  return [
    field
      .isArray({ min: 1, max: 3 })
      .withMessage('Изображений должно быть от 1 до 3'),
    field
      .custom((value) => value.every((img) => typeof img === 'string' && img.trim().length > 0))
      .withMessage('Каждое изображение должно быть непустой строкой'),
  ];
};

const createProductValidator = [
  body('name')
    .isString()
    .withMessage('Название обязательно')
    .trim()
    .notEmpty()
    .withMessage('Название обязательно')
    .isLength({ max: 200 })
    .withMessage('Название слишком длинное'),
  body('description')
    .isString()
    .withMessage('Описание обязательно')
    .trim()
    .notEmpty()
    .withMessage('Описание обязательно'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Цена должна быть положительным числом'),
  ...imageChain(),
  handleValidation,
];

const updateProductValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Название должно быть строкой')
    .trim()
    .notEmpty()
    .withMessage('Название не может быть пустым')
    .isLength({ max: 200 })
    .withMessage('Название слишком длинное'),
  body('description')
    .optional()
    .isString()
    .withMessage('Описание должно быть строкой')
    .trim()
    .notEmpty()
    .withMessage('Описание не может быть пустым'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Цена должна быть положительным числом'),
  body('category')
    .optional()
    .isString()
    .withMessage('Категория должна быть строкой'),
  body('image')
    .optional()
    .isArray({ min: 1, max: 3 })
    .withMessage('Изображений должно быть от 1 до 3'),
  handleValidation,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  handleValidation,
};
