const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Category = require('./category');
const University = require('./university');
const Dorm = require('./dorm');
const StudyField = require('./studyField');

// Define associations
User.belongsTo(StudyField, { foreignKey: 'studyFieldId' });
User.belongsTo(University, { foreignKey: 'universityId' });
User.belongsTo(Dorm, { foreignKey: 'dormId' });
User.hasMany(Post, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });

Post.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });
Post.hasMany(Comment, { foreignKey: 'postId' });

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

Category.hasMany(Post, { foreignKey: 'categoryId' });

module.exports = {
    sequelize,
    User,
    Post,
    Comment,
    Category,
    University,
    Dorm,
    StudyField
};
