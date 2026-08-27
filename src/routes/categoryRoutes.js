const router = require('express').Router();
const controller = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: List all categories
 *     tags: [Category]
 *     responses:
 *       200: { description: List of categories }
 *   post:
 *     summary: Create a category (admin)
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               order: { type: number }
 *               active: { type: boolean }
 *     responses:
 *       201: { description: Created }
 */
router.get('/', controller.getAllCategories);
router.post('/', protect, controller.createCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category (admin)
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     summary: Delete a category (admin)
 *     tags: [Category]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { name: id, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted }
 */
router.put('/:id', protect, controller.updateCategory);
router.delete('/:id', protect, controller.deleteCategory);

module.exports = router;
