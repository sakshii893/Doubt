const express = require('express');
const { body } = require('express-validator');
const {
  addComment,
  getCommentsByDoubt
} = require('../controllers/commentController');

const { protect } = require('../middleware/authmiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const rateLimiterMiddleware = require('../middleware/rateLimiter');

const router = express.Router();

// Mentor: Add comment to a doubt
router.post(
  '/:doubtId',
  protect,
  authorizeRoles('mentor','student'),
  [body('text').notEmpty().withMessage("Comment text is required")],
  rateLimiterMiddleware,
  addComment
);

// Student/Mentor: Get all comments for a doubt
router.get('/:doubtId', protect, rateLimiterMiddleware, getCommentsByDoubt);

module.exports = router;
