const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/isAuth');
const logger = require('../config/logger');

const router = express.Router();

router.post(
    '/create',
    isAuth,
    [
        body('content').not().isEmpty(),
        body('postId').isInt()
    ],
    (req, res, next) => {
        logger.info('Create comment route called');
        next();
    },
    commentController.createComment
);

router.get(
    '/:postId',
    (req, res, next) => {
        logger.info(`Get comments route called for postId: ${req.params.postId}`);
        next();
    },
    commentController.getComments
);

router.put(
    '/update/:commentId',
    isAuth,
    [
        body('content').not().isEmpty()
    ],
    (req, res, next) => {
        logger.info(`Update comment route called for commentId: ${req.params.commentId}`);
        next();
    },
    commentController.updateComment
);

router.delete(
    '/delete/:commentId',
    isAuth,
    (req, res, next) => {
        logger.info(`Delete comment route called for commentId: ${req.params.commentId}`);
        next();
    },
    commentController.deleteComment
);

module.exports = router;
