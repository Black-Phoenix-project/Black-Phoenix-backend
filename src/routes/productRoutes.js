const router = require('express').Router();
const controller = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');
const { createProductValidator, updateProductValidator } = require('../validators/productValidator');

router.post('/', protect, createProductValidator, controller.createProduct);

router.get('/', controller.getAllProducts);

router.get('/:id', controller.getProduct);

router.put('/:id', protect, updateProductValidator, controller.updateProduct);

router.patch('/:id', protect, updateProductValidator, controller.patchProduct);

router.delete('/:id', protect, controller.deleteProduct);

module.exports = router;
