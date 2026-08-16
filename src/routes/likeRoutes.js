const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const protectClient = require('../middleware/clientAuthMiddleware');
const { likeLimiter } = require('../middleware/rateLimiter');

router.get('/', protectClient, likeController.getUserLikes);
router.get('/user/:userId', protectClient, likeController.getUserLikes);
router.get('/check', protectClient, likeController.checkLike);
router.get('/product/:productId/count', likeController.getProductLikeCount);

router.post('/', protectClient, likeLimiter, likeController.addLike);
router.post('/toggle', protectClient, likeLimiter, likeController.toggleLike);

router.delete('/', protectClient, likeLimiter, likeController.removeLike);

module.exports = router;
