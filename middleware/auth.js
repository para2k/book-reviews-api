const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        // Get the token from the Authorization header. It should be in the format "Xyz <token>"
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: "Token is not valid" });
        }
    } catch (error) {
        res.status(401).json({ error: "Not authorized" });
    }
};

module.exports = protect;