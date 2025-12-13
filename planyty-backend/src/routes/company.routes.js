// Create or update src/routes/company.routes.js
const express = require('express');
const router = express.Router();
const { sendCompanyInvitations } = require('../controllers/invitation.controller');

// Public route for company onboarding
router.post('/onboard', sendCompanyInvitations);

module.exports = router;