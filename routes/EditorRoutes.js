const express = require("express");
const router = express.Router();
const { addEditor, loginEditor, fetchEditorProfile, updateEditorProfile } = require("../controllers/EditorController");
const authenticate = require("../middleware/auth"); // Middleware for JWT authentication


router.post("/add", addEditor);  // New route for adding an editor

// Editor Login
router.post("/login", loginEditor);

// Fetch Editor Profile (Protected)
router.get("/profile/:id", authenticate, fetchEditorProfile);

// Update Editor Profile (Protected)
router.put("/update/:id", authenticate, updateEditorProfile);

module.exports = router;
