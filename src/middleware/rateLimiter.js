const rateLimit = require('express-rate-limit');

const standard = {
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Слишком много запросов. Попробуйте позже.',
  },
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  ...standard,
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  ...standard,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  ...standard,
});

const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  ...standard,
});

const likeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 120,
  ...standard,
});

module.exports = {
  authLimiter,
  searchLimiter,
  uploadLimiter,
  orderLimiter,
  likeLimiter,
};
