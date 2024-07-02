const Comment = require('../models/comment');
const logger = require('../config/logger');

exports.createComment = async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.userId;

    try {
        const comment = await Comment.create({ content, postId, userId });
        logger.info('Comment created successfully:', comment.id);
        res.status(201).json({ message: 'Comment created!', commentId: comment.id });
    } catch (err) {
        logger.error('Comment creation failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ where: { postId: req.params.postId } });
        logger.info('Comments retrieved successfully');
        res.status(200).json({ comments });
    } catch (err) {
        logger.error('Failed to retrieve comments:', err);
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
            logger.warn('Unauthorized attempt to update comment:', commentId);
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Comment.update({ content }, { where: { id: commentId } });
        logger.info('Comment updated successfully:', commentId);
        res.status(200).json({ message: 'Comment updated!' });
    } catch (err) {
        logger.error('Comment update failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    try {
        const comment = await Comment.findByPk(commentId);
        if (comment.userId !== userId) {
            logger.warn('Unauthorized attempt to delete comment:', commentId);
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Comment.destroy({ where: { id: commentId } });
        logger.info('Comment deleted successfully:', commentId);
        res.status(200).json({ message: 'Comment deleted!' });
    } catch (err) {
        logger.error('Comment deletion failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
