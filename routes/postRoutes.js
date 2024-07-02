const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth, postController.getPosts);
router.get('/create', isAuth, postController.getCreatePost);
router.post('/create', isAuth, [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], postController.createPost);

router.get('/edit/:id', isAuth, postController.getEditPost);
router.post('/edit/:id', isAuth, [
    body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], postController.editPost);

router.post('/delete/:id', isAuth, postController.deletePost);

module.exports = router;
