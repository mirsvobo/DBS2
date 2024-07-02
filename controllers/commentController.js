const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.userId;

    try {
        const comment = await Comment.create({ content, postId, userId });
        res.status(201).json({ message: 'Comment created!', commentId: comment.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ where: { postId: req.params.postId } });
        res.status(200).json({ comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Přidej další metody pro update a delete
