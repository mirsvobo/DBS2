const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const { sequelize, User } = require('./models'); // Import from models/index.js
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Import chat routes
const jwt = require('jsonwebtoken');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'your_secret_key');
            const user = await User.findByPk(decodedToken.userId);
            req.user = user;
        } catch (err) {
            console.log(err);
        }
    }
    next();
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes); // Přidat trasy pro chat

app.get('/', (req, res, next) => {
    if (req.user) {
        return res.redirect('/posts');
    }
    res.redirect('/auth/login');
});

const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false });

        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

initDatabase().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
