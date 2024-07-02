const express = require('express');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/create', isAuth, commentController.createComment);
router.get('/:postId', commentController.getComments);

// Přidej další routy pro update a delete

module.exports = router;
