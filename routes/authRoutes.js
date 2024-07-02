const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const logger = require('../config/logger');

const router = express.Router();

router.post(
    '/register',
    [
        body('firstName').not().isEmpty(),
        body('lastName').not().isEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 5 })
    ],
    (req, res, next) => {
        logger.info('Register route called');
        next();
    },
    authController.register
);

router.post('/login', (req, res, next) => {
    logger.info('Login route called');
    next();
}, authController.login);

module.exports = router;
