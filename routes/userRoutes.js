const express = require("express");
const protect = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

//Register new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        //Create new user
        const user = new User({
            name,
            email,
            password,
        });

        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and generate JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Successfully logged in and JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the logged-in user
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */


//Login user and generate JWT token
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //Compare password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        //Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get logged-in user's data (Authenticated)
 *     tags: [Users]
 *     security:
 *        -bearerAuth: []  # Authentication using JWT
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


//Get logged-in user's data (Authenticated)
router.get("/me", protect,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;