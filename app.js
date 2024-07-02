const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const User = require('./models/user');
const Post = require('./models/post');
const Category = require('./models/category');
const Comment = require('./models/comment');
const StudyField = require('./models/studyField');
const University = require('./models/university');
const Dorm = require('./models/dorm');
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

app.get('/', (req, res, next) => {
    if (req.user) {
        return res.redirect('/posts');
    }
    res.redirect('/auth/login');
});

const initDatabase = async () => {
    try {
        await sequelize.sync({ force: false });

        // Add initial categories
        const categories = [
            { name: 'Spolujízda' },
            { name: 'Obecná nabídka' },
            { name: 'Obecná poptávka' },
            { name: 'Ubytování' },
            { name: 'Události' },
            { name: 'Ztráty a nálezy' }
        ];
        for (const category of categories) {
            await Category.create(category);
        }

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
