const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./post');
const User = require('./user');

const Like = sequelize.define('Like', {});

Like.belongsTo(Post, { foreignKey: 'postId' });
Like.belongsTo(User, { foreignKey: 'userId' });

module.exports = Like;
