const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "user"
    }
}, {
    timestamps: true,
    tableName: "Users"
});




module.exports = User;
