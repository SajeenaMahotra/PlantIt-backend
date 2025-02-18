// const { Sequelize } = require("sequelize");
// const sequelize = require("../database/db");

// const User = require("./User")(sequelize, Sequelize.DataTypes);
// const Blog = require("./Blog")(sequelize, Sequelize.DataTypes);
// const Editor = require("./Editor")(sequelize, Sequelize.DataTypes);
// const SavedBlog = require("./SavedBlog")(sequelize, Sequelize.DataTypes);

// // Define associations
// User.belongsToMany(Blog, { through: SavedBlog, foreignKey: "user_id" });
// Blog.belongsToMany(User, { through: SavedBlog, foreignKey: "blog_id" });
// Blog.belongsTo(Editor, { foreignKey: "editor_id", onDelete: "CASCADE" });

// module.exports = {
//     sequelize,
//     User,
//     Blog,
//     Editor,
//     SavedBlog,
// };

// associations.js
const User = require("./User");
const Blog = require("./Blog");
const Editor = require("./Editor");
const SavedBlog = require("./SavedBlog");

// Define associations
User.belongsToMany(Blog, { through: SavedBlog, foreignKey: "user_id" });
Blog.belongsToMany(User, { through: SavedBlog, foreignKey: "blog_id" });
Blog.belongsTo(Editor, { foreignKey: "editor_id", onDelete: "CASCADE" });

// Add these associations to ensure SavedBlog is linked to User and Blog
SavedBlog.belongsTo(User, { foreignKey: "user_id" });
SavedBlog.belongsTo(Blog, { foreignKey: "blog_id" });

module.exports = {
    User,
    Blog,
    Editor,
    SavedBlog,
};