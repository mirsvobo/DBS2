const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudyField = sequelize.define('StudyField', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = StudyField;
