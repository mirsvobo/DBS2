const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.getPosts = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId || null;
        const whereCondition = categoryId ? { categoryId } : {};

        const posts = await Post.findAll({
            where: whereCondition,
            include: [
                { model: User, attributes: ['firstName', 'lastName'] },
                { model: Category, attributes: ['name'] }
            ]
        });

        const categories = await Category.findAll();
        const recentPosts = await Post.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['firstName', 'lastName'] },
                { model: Category, attributes: ['name'] }
            ]
        });

        res.render('posts/index', {
            title: 'Forum',
            posts: posts,
            categories: categories,
            recentPosts: recentPosts,
            selectedCategoryId: categoryId,
            user: req.user  // Ensure user is passed to the template
        });
    } catch (err) {
        next(err);
    }
};

exports.getCreatePost = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('posts/create', { categories, user: req.user });
    } catch (err) {
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await Category.findAll();
        return res.status(422).render('posts/create', {
            user: req.user,
            errorMessage: errors.array()[0].msg,
            categories
        });
    }

    try {
        const { title, content, categoryId } = req.body;
        const post = await Post.create({
            title,
            content,
            categoryId,
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

        const categories = await Category.findAll();
        res.render('posts/edit', { post, categories, user: req.user });
    } catch (err) {
        next(err);
    }
};

exports.editPost = async (req, res, next) => {
    const errors = validationResult(req);
    const postId = req.params.id;
    const post = await Post.findByPk(postId);

    if (!errors.isEmpty()) {
        const categories = await Category.findAll();
        return res.status(422).render('posts/edit', {
            post,
            user: req.user,
            errorMessage: errors.array()[0].msg,
            categories
        });
    }

    try {
        const { title, content, categoryId } = req.body;
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        post.title = title;
        post.content = content;
        post.categoryId = categoryId;
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

exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByPk(postId, {
            include: [
                { model: User, attributes: ['firstName', 'lastName'] },
                { model: Category, attributes: ['name'] },
                { model: Comment, include: [User] } // Ujistěte se, že zahrnujete komentáře
            ]
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = await Comment.findAll({
            where: { postId },
            include: [User],
            order: [['createdAt', 'DESC']]
        });

        res.render('posts/view', { post, comments, user: req.user });
    } catch (err) {
        next(err);
    }
};
