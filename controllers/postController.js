const Post = require('../models/post');
const Like = require('../models/like');
const logger = require('../config/logger');

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;

    try {
        const post = await Post.create({ title, content, userId });
        logger.info('Post created successfully:', post.id);
        res.status(201).json({ message: 'Post created!', postId: post.id });
    } catch (err) {
        logger.error('Post creation failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        logger.info('Posts retrieved successfully');
        res.render('posts/index', { posts });
    } catch (err) {
        logger.error('Failed to retrieve posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        const post = await Post.findByPk(postId);
        if (post.userId !== userId) {
            logger.warn('Unauthorized attempt to update post:', postId);
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Post.update({ title, content }, { where: { id: postId } });
        logger.info('Post updated successfully:', postId);
        res.status(200).json({ message: 'Post updated!' });
    } catch (err) {
        logger.error('Post update failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        const post = await Post.findByPk(postId);
        if (post.userId !== userId) {
            logger.warn('Unauthorized attempt to delete post:', postId);
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Post.destroy({ where: { id: postId } });
        logger.info('Post deleted successfully:', postId);
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        logger.error('Post deletion failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.likePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        const like = await Like.create({ postId, userId });
        logger.info('Post liked successfully:', like.id);
        res.status(201).json({ message: 'Post liked!', likeId: like.id });
    } catch (err) {
        logger.error('Failed to like post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.unlikePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        await Like.destroy({ where: { postId, userId } });
        logger.info('Post unliked successfully:', postId);
        res.status(200).json({ message: 'Post unliked!' });
    } catch (err) {
        logger.error('Failed to unlike post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
