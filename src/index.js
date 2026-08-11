const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experiencesRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/experiences', experienceRoutes);

// Routes
app.get('/api/hi', (req, res) => {
    res.json({ message: 'Hi, Campus Prep API is running' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

