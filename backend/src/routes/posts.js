const express = require('express');
const router = express.Router();
const {
  generatePost,
  rewritePost,
  generateCarousel,
  toggleFavorite,
  getPosts,
  deletePost,
  getStats,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// All post routes require authentication
router.use(auth);

router.get('/', getPosts);

router.post('/generate', rateLimiter, generatePost);

router.post('/rewrite', rateLimiter, rewritePost);

router.post('/carousel', rateLimiter, generateCarousel);

router.patch('/:id/favorite', toggleFavorite);

router.delete('/:id', deletePost);

module.exports = router;
