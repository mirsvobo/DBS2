const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');
const Post = require('./post');
const University = require('./university');
const Dorm = require('./dorm');
const StudyField = require('./studyField');

// Associations
Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

User.belongsTo(University, { foreignKey: 'universityId' });
University.hasMany(User, { foreignKey: 'universityId' });

User.belongsTo(Dorm, { foreignKey: 'dormId' });
Dorm.hasMany(User, { foreignKey: 'dormId' });

User.belongsTo(StudyField, { foreignKey: 'studyFieldId' });
StudyField.hasMany(User, { foreignKey: 'studyFieldId' });

module.exports = {
    sequelize,
    User,
    Category,
    Post,
    University,
    Dorm,
    StudyField
};
