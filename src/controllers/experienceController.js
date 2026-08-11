const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createExperience = async (req, res) => {
    try {
        // 1. Grab the interview details from the request body
        const { companyId, role, year, verdict, difficulty, isAnonymous, body } = req.body || {};

        // 2. Grab the User ID from the token! 
        // Our 'protect' middleware automatically attaches this to req.user before this function runs.
        const authorId = req.user.userId;

        // 3. Basic validation
        if (!companyId || !role || !year || !verdict || !difficulty || !body) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        // 4. Save the new experience to Supabase
        const newExperience = await prisma.experience.create({
            data: {
                companyId: parseInt(companyId),
                authorId: authorId,
                role: role,
                year: parseInt(year),
                verdict: verdict,
                difficulty: parseInt(difficulty),
                isAnonymous: isAnonymous || false,
                body: body
            }
        });

        // 5. Send success response
        res.status(201).json({
            message: "Interview experience posted successfully!",
            experience: newExperience
        });

    } catch (error) {
        console.error("Error creating experience:", error);
        res.status(500).json({ error: "Internal server error while posting experience." });
    }
};


//getExperiences
const getAllExperiences = async (req, res) => {
    try {
        // Fetch all experiences from Supabase
        const experiences = await prisma.experience.findMany({
            // Sort by newest first
            orderBy: {
                createdAt: 'desc'
            },
            // This is the magic of Relational Databases!
            // We tell Prisma to pull in the related Company and Author data.
            include: {
                company: {
                    select: {
                        name: true,
                        logoUrl: true
                    }
                },
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Optional but awesome: Handle the "isAnonymous" privacy toggle
        // If a student checked "isAnonymous", we mask their name before sending it to the frontend.
        const sanitizedExperiences = experiences.map(exp => {
            if (exp.isAnonymous) {
                exp.author.name = "Anonymous Student";
            }
            return exp;
        });

        res.status(200).json({
            count: sanitizedExperiences.length,
            experiences: sanitizedExperiences
        });

    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ error: "Internal server error while fetching experiences." });
    }
};

// Don't forget to export it!
module.exports = { createExperience, getAllExperiences };