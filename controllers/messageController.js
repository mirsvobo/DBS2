const Message = require('../models/message');

exports.sendMessage = async (req, res) => {
    const { content, receiverId } = req.body;
    const senderId = req.userId;

    try {
        const message = await Message.create({ content, senderId, receiverId });
        res.status(201).json({ message: 'Message sent!', messageId: message.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ where: { receiverId: req.userId } });
        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
