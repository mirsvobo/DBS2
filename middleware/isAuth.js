const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/auth/login');
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, 'your_secret_key');
        } catch (err) {
            return res.redirect('/auth/login');
        }

        if (!decodedToken) {
            return res.redirect('/auth/login');
        }

        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAuth;
