const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();
const rateLimiter = require("../middleware/rateLimiter")

// Register Route
router.post(
  '/register',
  [
  
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Valid email is required"),
    body('password').isLength({ min: 6 }).withMessage("Password must be 6+ characters"),
    body('role').isIn(['student', 'mentor']).withMessage("Role must be student or mentor")
  ],
  registerUser
);


// Login Route
router.post('/login', [
  
  body('email').isEmail().withMessage("Valid email is required"),
  body('password').exists().withMessage("Password is required")
], rateLimiter, loginUser);

module.exports = router;
