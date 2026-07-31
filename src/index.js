const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/api/hi', (req, res) => {
    res.json({ message: 'Hi,Campus Prep API is running' });
});