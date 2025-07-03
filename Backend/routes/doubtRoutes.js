const express = require('express');
const { body } = require('express-validator');
const {
  createDoubt,
  getDoubts,
  getMyDoubts,
  updateDoubt,
  deleteDoubt,
  markResolved
} = require('../controllers/doubtController');
const { getDoubtById } = require('../controllers/doubtController');


const { protect } = require('../middleware/authmiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const rateLimiterMiddleware = require('../middleware/rateLimiter');

const upload = require('../middleware/uploadMulter');

const router = express.Router();

// Student: Create doubt
router.post(
  '/',
  [
    protect,
    authorizeRoles('student'),
    rateLimiterMiddleware,
    upload.single("file"), // ✅ Add multer middleware
    body('title').notEmpty().withMessage("Title is required"),
    body('description').notEmpty().withMessage("Description is required")
  ],
  createDoubt
);


// Student: View their doubts
router.get('/my-doubts', protect, authorizeRoles('student'), getMyDoubts);

// Mentor: View all doubts
router.get('/', protect, authorizeRoles('mentor'), getDoubts);

// Student: Update own doubt
router.put('/:id', protect, authorizeRoles('student'), updateDoubt);

// Student: Delete own doubt
router.delete('/:id', protect, authorizeRoles('student'), deleteDoubt);
// Get single doubt by ID
router.get('/:id', protect, getDoubtById);


// Student: Mark as resolved (after mentor reply)
router.patch('/:id/resolve', protect, authorizeRoles('student'), markResolved);

module.exports = router;
