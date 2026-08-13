const router = require('express').Router();
const upload = require('../middleware/upload');
const { uploadSingle, uploadMultiple } = require('../controllers/uploadController');
const protect = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const fileTypeCheck = require('../middleware/fileTypeCheck');

// Bitta rasm yuklash (swiper uchun)
router.post('/single', protect, uploadLimiter, upload.single('image'), fileTypeCheck, uploadSingle);

// 1-3 ta rasm yuklash (product uchun)
router.post('/multiple', protect, uploadLimiter, upload.array('images', 3), fileTypeCheck, uploadMultiple);

module.exports = router;
