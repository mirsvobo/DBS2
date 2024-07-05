const bcrypt = require('bcrypt');
const { sequelize, University, Dorm, StudyField, Category, User, Post, Comment} = require('./models');

const universitiesData = [
    { name: 'Harvard University' },
    { name: 'Stanford University' },
    { name: 'MIT' },
    { name: 'University of Cambridge' },
    { name: 'University of Oxford' }
];

const dormsData = [
    { name: 'Adams House', universityId: 1 },
    { name: 'Winthrop House', universityId: 1 },
    { name: 'Crothers Hall', universityId: 2 },
    { name: 'Roble Hall', universityId: 2 },
    { name: 'Baker House', universityId: 3 },
    { name: 'MacGregor House', universityId: 3 },
    { name: 'Trinity Hall', universityId: 4 },
    { name: 'Johns College', universityId: 4 },
    { name: 'Balliol College', universityId: 5 },
    { name: 'Magdalen College', universityId: 5 }
];

const studyFieldsData = [
    { name: 'Computer Science' },
    { name: 'Mathematics' },
    { name: 'Physics' },
    { name: 'Engineering' },
    { name: 'Biology' },
    { name: 'Chemistry' },
    { name: 'Economics' },
    { name: 'Political Science' }
];

const categoriesData = [
    { name: 'General Discussion' },
    { name: 'Events' },
    { name: 'Lost and Found' },
    { name: 'Housing' },
    { name: 'Rideshare' }
];

const usersData = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: bcrypt.hashSync('password', 10), universityId: 1, dormId: 1, studyFieldId: 1 },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: bcrypt.hashSync('password', 10), universityId: 2, dormId: 3, studyFieldId: 2 },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', password: bcrypt.hashSync('password', 10), universityId: 3, dormId: 5, studyFieldId: 3 },
    { firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', password: bcrypt.hashSync('password', 10), universityId: 4, dormId: 7, studyFieldId: 4 },
    { firstName: 'Charlie', lastName: 'Davis', email: 'charlie.davis@example.com', password: bcrypt.hashSync('password', 10), universityId: 5, dormId: 9, studyFieldId: 5 },
    { firstName: 'David', lastName: 'Evans', email: 'david.evans@example.com', password: bcrypt.hashSync('password', 10), universityId: 1, dormId: 2, studyFieldId: 6 },
    { firstName: 'Eve', lastName: 'White', email: 'eve.white@example.com', password: bcrypt.hashSync('password', 10), universityId: 2, dormId: 4, studyFieldId: 7 },
    { firstName: 'Frank', lastName: 'Miller', email: 'frank.miller@example.com', password: bcrypt.hashSync('password', 10), universityId: 3, dormId: 6, studyFieldId: 8 },
    { firstName: 'Grace', lastName: 'Wilson', email: 'grace.wilson@example.com', password: bcrypt.hashSync('password', 10), universityId: 4, dormId: 8, studyFieldId: 1 },
    { firstName: 'Hank', lastName: 'Martinez', email: 'hank.martinez@example.com', password: bcrypt.hashSync('password', 10), universityId: 5, dormId: 10, studyFieldId: 2 },
    { firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: bcrypt.hashSync('admin', 10), role: 'admin', universityId: 1, dormId: 1, studyFieldId: 1 }
];

const postsData = [
    { title: 'Welcome to the Forum', content: 'This is the first post.', userId: 1, categoryId: 1 },
    { title: 'Lost Item', content: 'I lost my backpack.', userId: 2, categoryId: 3 },
    { title: 'Event Announcement', content: 'Join us for the annual festival.', userId: 3, categoryId: 2 },
    { title: 'Housing Available', content: 'Looking for a roommate.', userId: 4, categoryId: 4 },
    { title: 'Carpool Needed', content: 'Need a ride to the city.', userId: 5, categoryId: 5 }
];

const commentsData = [
    { content: 'Great post!', userId: 2, postId: 1 },
    { content: 'I found your backpack.', userId: 3, postId: 2 },
    { content: 'Can’t wait for the event.', userId: 4, postId: 3 },
    { content: 'I am interested.', userId: 5, postId: 4 },
    { content: 'I can give you a ride.', userId: 1, postId: 5 }
];


async function initDatabase() {
    try {
        await sequelize.sync({ force: true });

        await University.bulkCreate(universitiesData);
        await Dorm.bulkCreate(dormsData);
        await StudyField.bulkCreate(studyFieldsData);
        await Category.bulkCreate(categoriesData);
        await User.bulkCreate(usersData);
        await Post.bulkCreate(postsData);
        await Comment.bulkCreate(commentsData);

        console.log('Database synchronized and data seeded successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

module.exports = initDatabase;
