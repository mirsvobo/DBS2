const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const University = require('./university');
const Dorm = require('./dorm');
const StudyField = require('./studyField');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    studyFieldId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'StudyFields',
            key: 'id'
        }
    },
    universityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Universities',
            key: 'id'
        }
    },
    dormId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Dorms',
            key: 'id'
        }
    }
});

User.belongsTo(University, { foreignKey: 'universityId' });
User.belongsTo(Dorm, { foreignKey: 'dormId' });
User.belongsTo(StudyField, { foreignKey: 'studyFieldId' });

module.exports = User;
