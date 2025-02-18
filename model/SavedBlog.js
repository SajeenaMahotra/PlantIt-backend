const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");
const Blog = require("./Blog");

const SavedBlog = sequelize.define("SavedBlog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    // user_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    // blog_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Blog,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    saved_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "SavedBlogs",
});


module.exports = SavedBlog;
