const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const ViewedBlog = sequelize.define("ViewedBlog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "ViewedBlogs",
});

module.exports = ViewedBlog;