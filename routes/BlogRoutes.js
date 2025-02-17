const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const BlogController = require("../controllers/BlogController");

const router = express.Router();

router.post("/create", auth, upload.single("image"), BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.get("/published", BlogController.getPublishedBlogs); 
router.get("/:id", BlogController.getBlogById);
router.get("/published/:editorId",BlogController. getPublishedBlogsByEditorId);
router.put("/:id", auth, upload.single("image"), BlogController.updateBlog);
router.delete("/:id", auth, BlogController.deleteBlog);

module.exports = router;
