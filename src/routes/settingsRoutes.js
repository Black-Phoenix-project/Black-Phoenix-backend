const router = require('express').Router();
const controller = require('../controllers/settingsController');
const protect = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get company settings
 *     tags: [Settings]
 *     responses:
 *       200: { description: Company settings }
 *   put:
 *     summary: Update company settings (admin)
 *     tags: [Settings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               description: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               address: { type: string }
 *               aboutText: { type: string }
 *               socials: { type: object }
 *     responses:
 *       200: { description: Updated }
 */
router.get('/', controller.getSettings);
router.put('/', protect, controller.updateSettings);

module.exports = router;
