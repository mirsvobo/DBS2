const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dorm = sequelize.define('Dorm', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Dorm;
