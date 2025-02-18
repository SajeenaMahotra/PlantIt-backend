const { DataTypes } = require("sequelize");
const sequelize = require("../database/db"); 
const Editor = require("./Editor"); 


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
            model: Editor, 
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
        type: DataTypes.STRING,  
        allowNull: false,         
    },
    image_path: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    category: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    tags:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false
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
    timestamps: true, 
    tableName: "Blogs",
});

// Blog.belongsTo(Editor, { foreignKey: "editor_id", onDelete: "CASCADE" });

module.exports = Blog;
