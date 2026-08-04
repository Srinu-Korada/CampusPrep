const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

// When someone makes a POST request to /register, run the registerUser function
router.post('/register', registerUser);

module.exports = router;