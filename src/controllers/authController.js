
// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Import jsonwebtoken
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    try {
        // 1. Grab the data the user sent in the request body
        const { name, email, password, branch, batch } = req.body || {};

        // 2. Validate that the required fields are not empty
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required." });
        }

        // 3. Check if this email is already in our database
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }

        // 4. Hash (scramble) the password
        // 'salt' adds random data to the hash to make it impossible to guess
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Save the new user to Supabase
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: hashedPassword, // NEVER save the plain text password!
                branch: branch,
                batch: batch
            }
        });

        // 6. Send a success response back to the user
        res.status(201).json({
            message: "Student registered successfully!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // 1. Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password." });
        }

        // 2. Find user in database
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        // Note: Use a generic error message for security so hackers don't know if email or password was wrong
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // 3. Compare hashed passwords
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // 4. Generate the JWT (The Wristband)
        // We embed the user's ID and Role inside the token payload
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // 5. Send back success response with the token
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Don't forget to export loginUser alongside registerUser!
module.exports = { registerUser, loginUser };