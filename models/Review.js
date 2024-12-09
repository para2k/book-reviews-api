const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Review content is required"],
        minlength: 10,
    },
    rating: {
        type: Number,
        required: [true, "Review rating is required"],
        min: 1,
        max: 5,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Review", ReviewSchema);