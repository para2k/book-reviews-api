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
    const result = await Review.aggregate([
        { $match: { book: this._id } },
        { $group: { _id: "$book", avgRating: { $avg: "$rating" } } }
    ]);

    if(result.length === 0) return 0; 
    return result[0].avgRating.toFixed(2);
};

module.exports = mongoose.model("Book", BookSchema);
    