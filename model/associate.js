const User = require("./User");
const Blog = require("./Blog");
const Editor = require("./Editor");
const SavedBlog = require("./SavedBlog");
const ViewedBlog = require("./ViewedBlog")


User.belongsToMany(Blog, { through: SavedBlog, foreignKey: "user_id" });
Blog.belongsToMany(User, { through: SavedBlog, foreignKey: "blog_id" });

User.belongsToMany(Blog, { through: ViewedBlog, foreignKey: "user_id" });
Blog.belongsToMany(User, { through: ViewedBlog, foreignKey: "blog_id" });

Blog.belongsTo(Editor, { foreignKey: "editor_id", onDelete: "CASCADE" });

SavedBlog.belongsTo(User, { foreignKey: "user_id" });
SavedBlog.belongsTo(Blog, { foreignKey: "blog_id" });

ViewedBlog.belongsTo(User, { foreignKey: "user_id" });
ViewedBlog.belongsTo(Blog, { foreignKey: "blog_id",  as: "blog"});

module.exports = {
    User,
    Blog,
    Editor,
    SavedBlog,
    ViewedBlog
};