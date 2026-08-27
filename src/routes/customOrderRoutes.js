const router = require('express').Router();
const controller = require('../controllers/customOrderController');
const protect = require('../middleware/authMiddleware');
const { orderLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /api/custom-orders:
 *   get:
 *     summary: List custom workwear requests (admin)
 *     tags: [CustomOrders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of requests }
 *   post:
 *     summary: Submit a custom workwear request (public)
 *     tags: [CustomOrders]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, requirements]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               category: { type: string }
 *               requirements: { type: string }
 *     responses:
 *       201: { description: Request submitted }
 */
router.post('/', orderLimiter, controller.createCustomOrder);
router.get('/', protect, controller.getAllCustomOrders);

/**
 * @swagger
 * /api/custom-orders/{id}/status:
 *   patch:
 *     summary: Update request status (admin)
 *     tags: [CustomOrders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Updated }
 */
router.patch('/:id/status', protect, controller.updateCustomOrderStatus);
router.delete('/:id', protect, controller.deleteCustomOrder);

module.exports = router;
