const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *                 example: "To Kill a Mockingbird"
 *               author:
 *                 type: string
 *                 description: Author of the book
 *                 example: "Harper Lee"
 *               description:
 *                 type: string
 *                 description: Description of the book
 *                 example: "A novel about the serious issues of rape and racial inequality."
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Book already exists
 *       500:
 *         description: Server error
 */


//Create new book
router.post("/", async (req, res) => {
    const { title, author, description } = req.body;

    try {
        //Check if book exists
        const bookExists = await Book.findOne({ title, author });

        if (bookExists) {
            return res.status(400).json({ error: "Book already exists" });
        }

        //Create new book
        const book = new Book({
            title,
            author,
            description,
        });

        await book.save();

        res.status(201).json({ message: "Book created successfully" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Successfully retrieved all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */

//Get all books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find().populate("reviews");

        //Loop through all books and calculate average rating for each book
        const booksWithAvgRating = await Promise.all(
            books.map(async (book) => {
                const avgRating = await book.calculateAverageRating();
                return { ...book.toObject(), avgRating };
            })
        )
        res.json(booksWithAvgRating);

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/** 
 * @swagger 
 * /api/books/{id}: 
 *   get: 
 *     summary: Get a book by ID 
 *     tags: [Books] 
 *     parameters: 
 *       - in: path 
 *         name: id 
 *         required: true 
 *         description: ID of the book 
 *         schema: 
 *           type: string 
 *     responses: 
 *       200: 
 *         description: Successfully retrieved book 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Book'
 *       404: 
 *         description: Book not found 
 *       500: 
 *         description: Server error 
 */

//Get book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("reviews");
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        const avgRating = await book.calculateAverageRating();

        res.json({ ...book.toObject(), avgRating });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/** 
 * @swagger 
 * /api/books/{id}: 
 *   patch: 
 *     summary: Update a book by ID 
 *     tags: [Books] 
 *     parameters: 
 *       - in: path 
 *         name: id 
 *         required: true 
 *         description: ID of the book 
 *         schema: 
 *           type: string 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object 
 *             properties: 
 *               title: 
 *                 type: string 
 *                 description: Title of the book 
 *                 example: "Modified Title" 
 *               author: 
 *                 type: string 
 *                 description: Author of the book 
 *                 example: "Modified Author" 
 *               description: 
 *                 type: string 
 *                 description: Description of the book 
 *                 example: "Modified Description." 
 *     responses: 
 *       200: 
 *         description: Book updated successfully 
 *       400:
 *         description: No changes detected. Title, author or description must be updated.
 *       404: 
 *         description: Book not found 
 *       500: 
 *         description: Server error 
 */


//Update book by ID
router.patch("/:id", async (req, res) => {
    try {
        const existingBook = await Book.findById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (existingBook.title === req.body.title && existingBook.author === req.body.author && existingBook.description === req.body.description) {
            return res.status(400).json({ error: "No changes detected. Title, author or description must be updated." });
        }

        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate("reviews");

        res.json(book);

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */



//Delete book by ID
router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;