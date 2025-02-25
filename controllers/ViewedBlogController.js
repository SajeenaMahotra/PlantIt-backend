const {ViewedBlog,Blog}= require('../model/associate');

const logBlogView = async (req, res) => {
        const { user_id, blog_id } = req.body;

        try {
            
            const existingView = await ViewedBlog.findOne({
                where: { user_id, blog_id },
            });

            if (existingView) {
                return res.status(200).json({ message: "Blog already viewed by the user." });
            }

            
            await ViewedBlog.create({ user_id, blog_id });
            res.status(201).json({ message: "Blog view logged successfully." });
        } catch (error) {
            console.error("Error logging viewed blog:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    
};

const getViewedBlogsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const viewedBlogs = await ViewedBlog.findAll({
            where: { user_id },
            include: [{ model: Blog, as: "blog" }], 
        });

        res.status(200).json(viewedBlogs);
    } catch (error) {
        console.error("Error fetching viewed blogs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports={logBlogView,getViewedBlogsByUser};