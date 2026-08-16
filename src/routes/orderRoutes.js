const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const protectClient = require('../middleware/clientAuthMiddleware');
const { orderLimiter } = require('../middleware/rateLimiter');
const {
  createOrderValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator,
} = require('../validators/orderValidator');

router.post('/', orderLimiter, createOrderValidator, orderController.createOrder);

router.get('/', protect, orderController.getAllOrders);

router.get('/stats', protect, orderController.getOrderStats);

router.get('/username/:username', protectClient, orderController.getOrdersByUsername);

router.get('/:id', protect, orderController.getOrderById);

router.put('/:id', protect, orderController.updateOrder);

router.patch('/:id/status', protect, updateOrderStatusValidator, orderController.updateOrderStatus);

router.patch('/:id/payment', protect, updatePaymentStatusValidator, orderController.updatePaymentStatus);

router.delete('/:id', protect, orderController.deleteOrder);

module.exports = router;