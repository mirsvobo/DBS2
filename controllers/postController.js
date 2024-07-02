const Post = require('../models/post');
const Like = require('../models/like');

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;

    try {
        const post = await Post.create({ title, content, userId });
        res.status(201).json({ message: 'Post created!', postId: post.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json({ posts });
    } catch (err) {
        console.error(err);
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
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Post.update({ title, content }, { where: { id: postId } });
        res.status(200).json({ message: 'Post updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        const post = await Post.findByPk(postId);
        if (post.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await Post.destroy({ where: { id: postId } });
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.likePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        const like = await Like.create({ postId, userId });
        res.status(201).json({ message: 'Post liked!', likeId: like.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.unlikePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.userId;

    try {
        await Like.destroy({ where: { postId, userId } });
        res.status(200).json({ message: 'Post unliked!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
