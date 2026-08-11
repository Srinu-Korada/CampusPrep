// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        // 1. Look for the Authorization header
        let token;
        const authHeader = req.header('Authorization');

        if (authHeader && authHeader.startsWith('Bearer')) {
            // Split "Bearer <token>" and just grab the token part
            token = authHeader.split(' ')[1];
        }

        // 2. If there is no token, reject the request
        if (!token) {
            return res.status(401).json({ error: "Not authorized to access this route. No token provided." });
        }

        // 3. Verify the token (Is it real? Is it expired?)
        // This will throw an error if the token is fake or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the user data to the request!
        // We put userId and role into the token when they logged in.
        // Now, we attach it to 'req.user' so our controllers know EXACTLY who is making the request.
        req.user = decoded;

        // 5. Let the user pass through to the controller
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ error: "Not authorized. Token failed." });
    }
};

module.exports = { protect };