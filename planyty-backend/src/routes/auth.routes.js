const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { userValidations } = require('../utils/validators');

// Public routes
router.post('/register', 
  validate(userValidations.register),
  authController.register
);

router.post('/login',
  validate(userValidations.login),
  authController.login
);

// Protected routes
router.get('/profile', 
  authenticate, 
  authController.getProfile
);

module.exports = router;