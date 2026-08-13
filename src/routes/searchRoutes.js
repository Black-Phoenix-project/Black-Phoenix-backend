const router = require('express').Router();
const { search } = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');

// GET /api/search?q=...&sort=...&inStock=1&minPrice=...&maxPrice=...&page=1&limit=20
router.get('/', searchLimiter, search);

module.exports = router;
