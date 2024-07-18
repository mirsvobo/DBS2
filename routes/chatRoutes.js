const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/send', isAuth, [
    body('receiverId').isInt().withMessage('Receiver ID is required'),
    body('content').notEmpty().withMessage('Content is required')
], messageController.sendMessage);

router.get('/:userId', isAuth, messageController.getMessages);
router.get('/', isAuth, messageController.getChat);

module.exports = router;
