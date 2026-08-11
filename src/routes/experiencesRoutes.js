const express = require('express');
const router = express.Router();

// Import the controller and the middleware
const { createExperience, getAllExperiences } = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

// The Route: POST /api/experiences
// Notice how 'protect' sits in the middle. If there's no valid token, createExperience never runs!
router.post('/', protect, createExperience);

// GET route to fetch all experiences (no auth needed for reading!)
router.get('/', getAllExperiences);

module.exports = router;