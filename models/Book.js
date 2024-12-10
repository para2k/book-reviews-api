const mongoose = require("mongoose");
const Review = require("./Review");

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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
}, {
    timestamps: true // adds createdAt and updatedAt timestamps
});

//Create average rating for the book using aggregation
BookSchema.methods.calculateAverageRating = async function () {
    try {
    const result = await Review.aggregate([
        { $match: { book: this._id } },
        { $group: { _id: "$book", avgRating: { $avg: "$rating" } } }
    ]);

    if(result.length === 0) return 0; 
    return result[0].avgRating.toFixed(2);
    } catch (error) {
        console.error("Error calculating average rating:", error);
        return 0;
    }
};

module.exports = mongoose.model("Book", BookSchema);
    