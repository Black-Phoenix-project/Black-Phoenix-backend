const express = require('express');
const router = express.Router();
const { register, login, allUsers } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { adminLoginValidator, adminRegisterValidator } = require('../validators/authValidator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, password]
 *             properties:
 *               phoneNumber: { type: string, example: "998901234567" }
 *               password: { type: string, example: "secret123" }
 *               fullName: { type: string }
 *     responses:
 *       201: { description: User registered }
 *       400: { description: Validation error }
 *       401: { description: Admin token required }
 */
router.post('/register', authLimiter, protect, adminRegisterValidator, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, password]
 *             properties:
 *               phoneNumber: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authLimiter, adminLoginValidator, login);

/**
 * @swagger
 * /api/auth/users/all:
 *   get:
 *     summary: List all users (admin)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 */
router.get('/users/all', protect, allUsers);

module.exports = router;
