// models/Blog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db"); // Your Sequelize connection file
const Editor = require("./Editor"); // Import the Editor model

const Blog = sequelize.define("Blog", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    editor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Editor, // Reference to the Editors table
            key: "editor_id",
        },
        onDelete: "CASCADE",
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,  // New description field
        allowNull: true,         // Set to true if optional, set to false if required
    },
    image_path: {
        type: DataTypes.STRING, // Path to the uploaded image
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true, // We are manually managing timestamps
    tableName: "Blogs",
});

Blog.belongsTo(Editor, { foreignKey: "editor_id", onDelete: "CASCADE" });

module.exports = Blog;
