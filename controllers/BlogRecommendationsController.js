const { Op } = require('sequelize');
const { Blog, SavedBlog, ViewedBlog } = require('../model/associate');
const { Sequelize } = require('sequelize');

const getBlogRecommendations = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch saved and viewed blogs
        const savedBlogs = await SavedBlog.findAll({ where: { user_id: userId } });
        const viewedBlogs = await ViewedBlog.findAll({ where: { user_id: userId } });

        // Extract blog IDs
        const savedBlogIds = savedBlogs.map(blog => blog.blog_id);
        const viewedBlogIds = viewedBlogs.map(blog => blog.blog_id);

        // Fetch blog details
        const savedBlogDetails = await Blog.findAll({ where: { id: savedBlogIds } });
        const viewedBlogDetails = await Blog.findAll({ where: { id: viewedBlogIds } });

        // Combine and analyze tags/categories
        const allBlogs = [...savedBlogDetails, ...viewedBlogDetails];
        const tagFrequency = {};
        const categoryFrequency = {};

        allBlogs.forEach(blog => {
            blog.tags.forEach(tag => {
                tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
            });
            categoryFrequency[blog.category] = (categoryFrequency[blog.category] || 0) + 1;
        });

        // Sort tags/categories by frequency
        const sortedTags = Object.keys(tagFrequency).sort((a, b) => tagFrequency[b] - tagFrequency[a]);
        const sortedCategories = Object.keys(categoryFrequency).sort((a, b) => categoryFrequency[b] - categoryFrequency[a]);

        // Fetch recommended blogs
        const recommendedBlogs = await Blog.findAll({
            where: {
                status: "published",
                [Op.or]: [
                    Sequelize.literal(`"tags" && ARRAY[:tags]::TEXT[]`), // Corrected SQL
                    { category: sortedCategories.slice(0, 3) }
                ],
                id: { [Op.notIn]: savedBlogIds }
            },
            replacements: {
                tags: sortedTags.slice(0, 3) // Pass the tags array as a replacement
            },
            limit: 5
        });

        res.status(200).json(recommendedBlogs);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getBlogRecommendations };