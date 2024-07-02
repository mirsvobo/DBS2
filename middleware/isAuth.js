const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const user = await User.findByPk(decodedToken.userId);
        if (!user) {
            return res.redirect('/auth/login');
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.redirect('/auth/login');
    }
};
