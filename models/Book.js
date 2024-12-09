const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Book author is required"],
    },
    description: {
        type: String,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, {
    timestamps: true // adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Book", BookSchema);
    