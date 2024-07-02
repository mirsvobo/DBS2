const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
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

module.exports = Like;
