const express = require('express');
const router = express.Router();
const {
    getAllSwipers,
    getSwiperById,
    createSwiper,
    updateSwiper,
    deleteSwiper
} = require('../controllers/swiperController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllSwipers);

router.get('/:id', getSwiperById);

router.post('/', protect, createSwiper);

router.put('/:id', protect, updateSwiper);

router.delete('/:id', protect, deleteSwiper);

module.exports = router;