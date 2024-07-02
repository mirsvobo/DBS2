const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    studyFieldId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'StudyFields',
            key: 'id'
        }
    },
    universityId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Universities',
            key: 'id'
        }
    },
    dormId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Dorms',
            key: 'id'
        }
    }
});

module.exports = User;
