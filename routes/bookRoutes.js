const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

//Create new book
router.post("/", async (req, res) => {
    const { title, author, description } = req.body;

    try {
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

//Get all books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();

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

//Get book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        const avgRating = await book.calculateAverageRating();

        res.json({...book.toObject(), avgRating});

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Update book by ID
router.patch("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if(!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Delete book by ID
router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if(!book) { 
            return res.status(404).json({ error: "Book not found" });
     }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;