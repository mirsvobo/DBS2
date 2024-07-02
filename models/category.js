const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Category.associate = (models) => {
    Category.hasMany(models.Post, { foreignKey: 'categoryId' });
};

module.exports = Category;
