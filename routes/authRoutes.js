const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/register',
    [
        body('firstName').not().isEmpty(),
        body('lastName').not().isEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 5 })
    ],
    authController.register
);

router.post('/login', authController.login);

module.exports = router;
