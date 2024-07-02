const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post(
    '/create',
    isAuth,
    [
        body('title').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    postController.createPost
);
router.get('/', postController.getPosts);
router.put(
    '/update/:postId',
    isAuth,
    [
        body('title').not().isEmpty(),
        body('content').not().isEmpty()
    ],
    postController.updatePost
);
router.delete('/delete/:postId', isAuth, postController.deletePost);
router.post('/like/:postId', isAuth, postController.likePost);
router.post('/unlike/:postId', isAuth, postController.unlikePost);

module.exports = router;
