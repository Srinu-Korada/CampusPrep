// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import loginUser from controller
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;