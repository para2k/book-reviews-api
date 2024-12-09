const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./config/database");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

//Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("API is running...!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});