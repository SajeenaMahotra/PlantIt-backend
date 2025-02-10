const Blog = require("../model/Blog");
const fs = require("fs");
const path = require("path");

// Create a blog
const createBlog = async (req, res) => {
    try {
        const { title, content, status } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required." });
        }

        // Check if a blog with the same title already exists
        const existingBlog = await Blog.findOne({ where: { title } });
        if (existingBlog) {
            return res.status(400).json({ error: "A blog with this title already exists." });
        }

        // Check if editorId exists, if not send error (should never happen with proper authentication)
        if (!req.editorId) {
            return res.status(400).json({ error: "Editor ID is missing." });
        }

        const newBlog = await Blog.create({
            title,
            content,
            image_path: imagePath,
            status,
            published_at: status === "published" ? new Date() : null,
            updated_at: new Date(),
            editor_id: req.editorId,
        });

        res.status(201).json({ message: "Blog created successfully.", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Internal server error",error: error.message });
    }
};


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        
        const blogsWithImages = blogs.map(blog => ({
            ...blog.toJSON(),
            imageUrl: blog.image_path ? `${req.protocol}://${req.get("host")}${blog.image_path}` : null
        }));

        res.json(blogsWithImages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found." });
        }

        // Add full image URL
        const blogWithImage = {
            ...blog.toJSON(),
            imageUrl: blog.image_path ? `${req.protocol}://${req.get("host")}${blog.image_path}` : null
        };

        res.json(blogWithImage);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a blog
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const { title, content, status } = req.body;
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        
        // Update the image path only if a new image was uploaded
        if (req.file) {
            blog.image_path = `/uploads/${req.file.filename}`;
        }

        blog.status = status || blog.status;
        blog.updatedAt = new Date();
        if (status === "published" && !blog.published_at) blog.published_at = new Date();
        

        await blog.save();
        res.json({ message: "Blog updated successfully.", blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found." });
        }

        // Delete image from storage if it exists
        if (blog.image_path) {
            const imagePath = path.join(__dirname, "..", blog.image_path); // Path to the image in the 'uploads' folder
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Remove the image file
            }
        }

        await blog.destroy();
        res.json({ message: "Blog deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
