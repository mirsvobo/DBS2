const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./post');
const User = require('./user');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Comment;
