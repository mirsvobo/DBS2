const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post(
    '/send',
    isAuth,
    [
        body('content').not().isEmpty(),
        body('receiverId').isInt()
    ],
    messageController.sendMessage
);
router.get('/', isAuth, messageController.getMessages);

module.exports = router;
