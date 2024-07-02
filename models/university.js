const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const University = sequelize.define('University', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = University;
