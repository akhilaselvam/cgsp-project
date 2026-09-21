const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Admin login, returns JWT token
// @access  Public
router.post('/login', loginAdmin);

module.exports = router;