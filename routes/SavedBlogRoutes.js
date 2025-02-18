const express = require("express");
const router = express.Router();
const { saveBlog, getSavedBlogs } = require("../controllers/SavedBlogController");

router.post("/save", saveBlog);
router.get("/user/:userId", getSavedBlogs);

module.exports = router;
