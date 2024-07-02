const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Post;
