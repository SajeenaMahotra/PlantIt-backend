const express = require("express");
const router = express.Router();
const { addEditor, loginEditor, fetchEditorProfile, updateEditorProfile } = require("../controllers/EditorController");
const authenticate = require("../middleware/auth"); 

router.post("/add", addEditor);  
router.post("/login", loginEditor);
router.get("/profile/:id", authenticate, fetchEditorProfile);
router.put("/update/:id", authenticate, updateEditorProfile);

module.exports = router;
