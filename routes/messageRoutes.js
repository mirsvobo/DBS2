const express = require('express');
const messageController = require('../controllers/messageController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/send', isAuth, messageController.sendMessage);
router.get('/', isAuth, messageController.getMessages);

module.exports = router;
