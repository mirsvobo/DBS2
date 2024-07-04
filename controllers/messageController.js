const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content } = req.body;
        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required' });
        }
        const message = await Message.create({
            content,
            senderId: req.user.id,
            receiverId
        });
        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id, receiverId: userId },
                    { senderId: userId, receiverId: req.user.id }
                ]
            },
            include: [
                { model: User, as: 'sender', attributes: ['firstName', 'lastName'] },
                { model: User, as: 'receiver', attributes: ['firstName', 'lastName'] }
            ],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        next(err);
    }
};

exports.getChat = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.id
                }
            },
            attributes: ['id', 'firstName', 'lastName']
        });
        res.render('chat/index', {
            title: 'Chat',
            user: req.user,
            users: users
        });
    } catch (err) {
        console.error('Error fetching users for chat:', err);
        next(err);
    }
};
