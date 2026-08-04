// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
    try {
        // 1. Grab the data the user sent in the request body
        const { name, email, password, branch, batch } = req.body;

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

module.exports = { registerUser };