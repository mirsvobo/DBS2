const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

module.exports = Comment;
