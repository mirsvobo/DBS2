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

exports.updateComment = async (req, res) => {
    const { content } = req.body;
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
        const comment = await Comment.findByPk(commentId);
        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Comment.update({ content }, { where: { id: commentId } });
        res.status(200).json({ message: 'Comment updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
        const comment = await Comment.findByPk(commentId);
        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Comment.destroy({ where: { id: commentId } });
        res.status(200).json({ message: 'Comment deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
