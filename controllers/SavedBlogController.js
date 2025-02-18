const SavedBlog = require("../model/SavedBlog");
const Blog = require("../model/Blog");

const saveBlog = async (req, res) => {
    try {
        const { user_id, blog_id } = req.body;

        const alreadySaved = await SavedBlog.findOne({ where: { user_id, blog_id } });
        if (alreadySaved) {
            return res.status(400).json({ message: "Blog already saved" });
        }

        const savedBlog = await SavedBlog.create({ user_id, blog_id });
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeSavedBlog = async (req, res) => {
    try {
        const { user_id, blog_id } = req.body;

        const savedBlog = await SavedBlog.findOne({ where: { user_id, blog_id } });
        if (!savedBlog) {
            return res.status(404).json({ message: "Blog not found in saved list" });
        }

        await savedBlog.destroy();
        res.json({ message: "Blog unsaved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSavedBlogs = async (req, res) => {
    try {
        
        const savedBlogs = await SavedBlog.findAll({ where: { user_id: req.params.userId },include: [{ model: Blog, required: true }] });
        res.json(savedBlogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isBlogSaved = async (req, res) => {
    try {
        const { user_id, blog_id } = req.params;

        const savedBlog = await SavedBlog.findOne({ where: { user_id, blog_id } });
        res.json({ isSaved: !!savedBlog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { saveBlog, removeSavedBlog, getSavedBlogs, isBlogSaved };
