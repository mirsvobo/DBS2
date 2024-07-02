const Post = require('../models/post');

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

// Přidej další metody pro update a delete
