const express = require('express');
const router = express.Router();
const { register, login, allUsers } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { adminLoginValidator, adminRegisterValidator } = require('../validators/authValidator');

router.post('/register', authLimiter, protect, adminRegisterValidator, register);

router.post('/login', authLimiter, adminLoginValidator, login);

router.get('/users/all', protect, allUsers);

module.exports = router;
