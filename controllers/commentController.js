const Comment = require('../models/comment');

exports.createComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const comment = await Comment.create({
            content,
            postId,
            userId: req.user.id
        });
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

exports.editComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { content } = req.body;
        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
