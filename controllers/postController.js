const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');
const Comment = require('../models/comment');
const University = require('../models/university'); // Přidejte tento řádek

exports.getPosts = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId || null;
        const universityId = req.query.universityId || null;
        const whereCondition = {};

        if (categoryId) {
            whereCondition.categoryId = categoryId;
        }

        if (universityId) {
            const users = await User.findAll({ where: { universityId } });
            const userIds = users.map(user => user.id);
            whereCondition.userId = userIds;
        }

        const posts = await Post.findAll({
            where: whereCondition,
            include: [
                { model: User, attributes: ['firstName', 'lastName'] },
                { model: Category, attributes: ['name'] }
            ]
        });

        const categories = await Category.findAll();
        const universities = await University.findAll();
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
            universities: universities,
            recentPosts: recentPosts,
            selectedCategoryId: categoryId,
            selectedUniversityId: universityId,
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
                { model: Comment, include: [User] }
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
