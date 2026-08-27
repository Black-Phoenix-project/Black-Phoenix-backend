const router = require('express').Router();
const controller = require('../controllers/discountController');
const protect = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/discount:
 *   get:
 *     summary: List discounts
 *     tags: [Discount]
 *     parameters:
 *       - { name: active, in: query, schema: { type: string } }
 *     responses:
 *       200: { description: List of discounts }
 *   post:
 *     summary: Create a discount (admin)
 *     tags: [Discount]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, value]
 *             properties:
 *               title: { type: string }
 *               type: { type: string, enum: [percent, fixed] }
 *               value: { type: number }
 *               scope: { type: string, enum: [global, product] }
 *               productId: { type: string }
 *               active: { type: boolean }
 *     responses:
 *       201: { description: Created }
 */
router.get('/', controller.getAllDiscounts);
router.post('/', protect, controller.createDiscount);

/**
 * @swagger
 * /api/discount/{id}:
 *   put:
 *     summary: Update a discount (admin)
 *     tags: [Discount]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     summary: Delete a discount (admin)
 *     tags: [Discount]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 */
router.put('/:id', protect, controller.updateDiscount);
router.delete('/:id', protect, controller.deleteDiscount);

module.exports = router;
