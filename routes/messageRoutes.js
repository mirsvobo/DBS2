const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/isAuth');
const logger = require('../config/logger');

const router = express.Router();

router.post(
    '/send',
    isAuth,
    [
        body('content').not().isEmpty(),
        body('receiverId').isInt()
    ],
    (req, res, next) => {
        logger.info('Send message route called');
        next();
    },
    messageController.sendMessage
);

router.get(
    '/',
    isAuth,
    (req, res, next) => {
        logger.info('Get messages route called');
        next();
    },
    messageController.getMessages
);

module.exports = router;
