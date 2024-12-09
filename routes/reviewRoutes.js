const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Book");
const protect = require("../middleware/auth");
const router = express.Router();

//Create new review for a book (auth required)
router.post("/:bookId", protect, async (req, res) => {
    const { bookId } = req.params;
    const { content, rating } = req.body;

    try {
        const book = await Book.findById(bookId);

        if (!book) { 
             return res.status(404).json({ error: "Book not found" });
             }

             //Create review
             const review = new Review({
                book: bookId,
                user: req.user._id,
                content,
                rating,
             });

             await review.save();

             res.status(201).json(review);

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Get reviews for a specific book (No auth required)
router.get("/:bookId", async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Update a review by ID (auth required, only author can update)
router.patch("/id", protect, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if(!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if(review.user.toString() !== req.user._id) {
            return res.status(401).json({ error: "Not authorized to update this review!" });
        }

        Object.assign(review, req.body);
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Delete a review by ID (auth required, only author can delete)
router.delete("/:id", protect,  async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if(!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if(review.user.toString() !== req.user._id) {
            return res.status(403).json({ error: "Not authorized to delete this review!" });
        }

        await review.deleteOne();

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;