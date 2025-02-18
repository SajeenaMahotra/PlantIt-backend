const express = require("express");
const router = express.Router();
const { saveBlog, removeSavedBlog, getSavedBlogs, isBlogSaved } = require("../controllers/SavedBlogController");


router.post("/save", saveBlog);
router.post("/unsave", removeSavedBlog);
router.get("/user/:userId", getSavedBlogs);
router.get("/isSaved/:user_id/:blog_id", isBlogSaved);

module.exports = router;
