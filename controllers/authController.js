const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const logger = require('../config/logger');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation failed for registration:', errors.array());
        return res.status(422).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        logger.info('User registered successfully:', user.id);
        res.status(201).json({ message: 'User registered!', userId: user.id });
    } catch (err) {
        logger.error('User registration failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.warn('Login failed: invalid email');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            logger.warn('Login failed: invalid password');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'secretkey',
            { expiresIn: '1h' }
        );

        logger.info('User logged in successfully:', user.id);
        res.status(200).json({ token, userId: user.id });
    } catch (err) {
        logger.error('Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
