const { validationResult } = require('express-validator');
const Comment = require('../models/comment');
const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');

exports.createComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
        const { content, postId } = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            content,
            postId,
            userId: req.user.id
        });

        res.redirect(`/posts/${postId}`);
    } catch (err) {
        next(err);
    }
};

exports.getEditComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId, {
            include: [User, Post]
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const post = await Post.findByPk(comment.postId, {
            include: [Category, User]
        });

        res.render('comments/edit', { comment, post, user: req.user });
    } catch (err) {
        next(err);
    }
};

exports.editComment = async (req, res, next) => {
    const errors = validationResult(req);
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);

    if (!errors.isEmpty()) {
        return res.status(422).render('comments/edit', {
            comment,
            user: req.user,
            errorMessage: errors.array()[0].msg
        });
    }

    try {
        const { content } = req.body;
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        comment.content = content;
        await comment.save();

        res.redirect(`/posts/${comment.postId}`);
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

        const postId = comment.postId;
        await comment.destroy();
        res.redirect(`/posts/${postId}`);
    } catch (err) {
        next(err);
    }
};
