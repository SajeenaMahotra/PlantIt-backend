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
      type: DataTypes.STRING, 
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
  }, {
    timestamps: true,
});

module.exports = PlantOfTheMonth;