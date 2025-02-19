const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const PlantOfTheMonth = sequelize.define('PlantOfTheMonth', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    procedure: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING, // This will store the path to the uploaded image
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING, // This can be the month of the plant feature
      allowNull: false,
    },
  }, {
    timestamps: true,
});

module.exports = PlantOfTheMonth;