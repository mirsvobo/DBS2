const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const logger = require('./config/logger');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
    res.redirect('/posts');
});

// Import models to ensure they are defined and associated properly
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Like = require('./models/like');
const University = require('./models/university');
const StudyField = require('./models/studyField');
const Dorm = require('./models/dorm');
const Message = require('./models/message');

sequelize.sync({ force: false }) // force: false to avoid dropping tables
    .then(result => {
        app.listen(3000, () => {
            logger.info('Server is running on port 3000');
        });
    })
    .catch(err => {
        logger.error('Unable to connect to the database:', err);
    });

app.use((err, req, res, next) => {
    logger.error('Something went wrong:', err);
    res.status(500).json({ message: 'Internal server error' });
});
