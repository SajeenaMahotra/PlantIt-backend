const SavedBlog = require("../model/SavedBlog");

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

const getSavedBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const savedBlogs = await SavedBlog.findAll({ where: { user_id: userId } });
        res.json(savedBlogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports={saveBlog,getSavedBlogs};
