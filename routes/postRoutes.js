const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');
const logger = require('../config/logger');

const router = express.Router();

router.post(
    '/create',
    isAuth,
    [
        body('title').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    (req, res, next) => {
        logger.info('Create post route called');
        next();
    },
    postController.createPost
);

router.get('/', (req, res, next) => {
    logger.info('Get posts route called');
    next();
}, postController.getPosts);

router.put(
    '/update/:postId',
    isAuth,
    [
        body('title').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    (req, res, next) => {
        logger.info(`Update post route called for postId: ${req.params.postId}`);
        next();
    },
    postController.updatePost
);

router.delete(
    '/delete/:postId',
    isAuth,
    (req, res, next) => {
        logger.info(`Delete post route called for postId: ${req.params.postId}`);
        next();
    },
    postController.deletePost
);

router.post(
    '/like/:postId',
    isAuth,
    (req, res, next) => {
        logger.info(`Like post route called for postId: ${req.params.postId}`);
        next();
    },
    postController.likePost
);

router.post(
    '/unlike/:postId',
    isAuth,
    (req, res, next) => {
        logger.info(`Unlike post route called for postId: ${req.params.postId}`);
        next();
    },
    postController.unlikePost
);

module.exports = router;
