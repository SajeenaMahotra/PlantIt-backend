const Blog = require("../model/Blog");
const fs = require("fs");
const path = require("path");

// Create a blog
const createBlog = async (req, res) => {
    try {
        const { title, content, status,category ,description} = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const tags = JSON.parse(req.body.tags); // Parse the tags from string to array


        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required." });
        }

        if (!category) {
            return res.status(400).json({ error: "Category is required." });
        }

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: "At least one tag is required." });
        }

        
        const existingBlog = await Blog.findOne({ where: { title } });
        if (existingBlog) {
            return res.status(400).json({ error: "A blog with this title already exists." });
        }

        
        if (!req.editorId) {
            return res.status(400).json({ error: "Editor ID is missing." });
        }

        const newBlog = await Blog.create({
            title,
            content,
            image_path: imagePath,
            status,
            description,
            category,
            tags,
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

const getPublishedBlogs = async (req, res) => {
    try {
        // Fetch only blogs that are published (status = 'published')
        const blogs = await Blog.findAll({
            where: { status: "published" },  // Correct condition for published blogs
        });

        const blogsWithImages = blogs.map(blog => ({
            ...blog.toJSON(),
            imageUrl: blog.image_path ? `${req.protocol}://${req.get("host")}${blog.image_path}` : null
        }));

        res.json(blogsWithImages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPublishedBlogsByEditorId = async (req, res) => {
    try {
        const { editorId } = req.params;
        const publishedBlogs = await Blog.findAll({
            where: {
                editor_id: editorId,
                status: "published",
            },
            attributes: ['id', 'title', 'content', 'image_path', 'category', 'tags', 'status', 'published_at'], // Explicitly select fields
           
        });
        if (!publishedBlogs.length ) {
            return res.status(404).json({ message: "No published blogs found." });
        }

        res.status(200).json(publishedBlogs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching published blogs" });
    }
};

// Get drafts by editorId
const getDraftsByEditorId = async (req, res) => {
    try {
        const { editorId } = req.params;  // Get editorId from URL parameters
        const drafts = await Blog.findAll({
            where: {
                editor_id: editorId,
                status: "draft",  // Only fetch drafts
            },
            attributes: ['id', 'title', 'content', 'image_path', 'category', 'tags', 'status', 'published_at'],
        });

        if (!drafts.length) {
            return res.status(404).json({ message: "No drafts found." });
        }

        res.status(200).json(drafts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching drafts" });
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

        const { title, content, status, description, category, tags } = req.body;
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.description = description || blog.description;
        blog.category = category || blog.category;
        blog.tags = tags ? tags.split(",").map(tag => tag.trim()) : blog.tags;
        
        
        if (req.file) {
            // Delete the old image if it exists
            if (blog.image_path) {
                const oldImagePath = path.join(__dirname, "..", blog.image_path);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            blog.image_path = `/uploads/${req.file.filename}`;
        }

        blog.status = status || blog.status;
        blog.updatedAt = new Date();
        if (status === "published" && !blog.published_at) blog.published_at = new Date();

        console.log("Updated blog data:", blog);
        

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

        if (blog.editor_id !== req.editorId) {
            return res.status(403).json({ error: "You are not authorized to delete this blog." });
        }
        
        if (blog.image_path) {
            const imagePath = path.join(__dirname, "..", blog.image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); 
            }
        }

        await blog.destroy();
        res.json({ message: "Blog deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createBlog, getAllBlogs, getPublishedBlogs,getPublishedBlogsByEditorId,getDraftsByEditorId, getBlogById, updateBlog, deleteBlog };
