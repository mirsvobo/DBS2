const Message = require('../models/message');
const logger = require('../config/logger');

exports.sendMessage = async (req, res) => {
    const { content, receiverId } = req.body;
    const senderId = req.userId;

    try {
        const message = await Message.create({ content, senderId, receiverId });
        logger.info('Message sent successfully:', message.id);
        res.status(201).json({ message: 'Message sent!', messageId: message.id });
    } catch (err) {
        logger.error('Message sending failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ where: { receiverId: req.userId } });
        logger.info('Messages retrieved successfully');
        res.status(200).json({ messages });
    } catch (err) {
        logger.error('Failed to retrieve messages:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
