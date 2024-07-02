const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res.render('posts/index', { posts, user: req.user });
    } catch (err) {
        next(err);
    }
};

exports.getCreatePost = (req, res, next) => {
    res.render('posts/create', { user: req.user });
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('posts/create', {
            user: req.user,
            errorMessage: errors.array()[0].msg
        });
    }

    try {
        const { title, content } = req.body;
        const post = await Post.create({
            title,
            content,
            userId: req.user.id
        });
        res.redirect('/posts');
    } catch (err) {
        next(err);
    }
};

exports.getEditPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.render('posts/edit', { post, user: req.user });
    } catch (err) {
        next(err);
    }
};

exports.editPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        return res.status(422).render('posts/edit', {
            post,
            user: req.user,
            errorMessage: errors.array()[0].msg
        });
    }

    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, content } = req.body;
        post.title = title;
        post.content = content;
        await post.save();

        res.redirect('/posts');
    } catch (err) {
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await post.destroy();
        res.redirect('/posts');
    } catch (err) {
        next(err);
    }
};
