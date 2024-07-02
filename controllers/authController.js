const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLogin = (req, res, next) => {
    if (req.user) {
        return res.redirect('/posts');
    }
    res.render('auth/login', {
        title: 'Login',
        errorMessage: null
    });
};

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            title: 'Login',
            errorMessage: errors.array()[0].msg
        });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).render('auth/login', {
                title: 'Login',
                errorMessage: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).render('auth/login', {
                title: 'Login',
                errorMessage: 'Invalid email or password.'
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/posts');
    } catch (err) {
        next(err);
    }
};

exports.getRegister = (req, res, next) => {
    if (req.user) {
        return res.redirect('/posts');
    }
    res.render('auth/register', {
        title: 'Register',
        errorMessage: null
    });
};

exports.postRegister = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/register', {
            title: 'Register',
            errorMessage: errors.array()[0].msg
        });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(422).render('auth/register', {
                title: 'Register',
                errorMessage: 'Email already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.redirect('/auth/login');
    } catch (err) {
        next(err);
    }
};

exports.postLogout = (req, res, next) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
};
