const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(400).json({ error: "Token does not contain valid user ID." });
        }

        // Check if the token contains a valid editor ID and role
        if (!decoded.id || decoded.role !== "editor") {
            return res.status(403).json({ error: "Unauthorized: Only editors can create blogs" });
        }
        // Attach the editor ID to the request object
        req.editorId = decoded.id;
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};
