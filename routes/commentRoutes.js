const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post(
    '/create',
    isAuth,
    [
        body('content').not().isEmpty(),
        body('postId').isInt()
    ],
    commentController.createComment
);
router.get('/:postId', commentController.getComments);
router.put(
    '/update/:commentId',
    isAuth,
    [
        body('content').not().isEmpty()
    ],
    commentController.updateComment
);
router.delete('/delete/:commentId', isAuth, commentController.deleteComment);

module.exports = router;
