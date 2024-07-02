const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/create', isAuth, [
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], commentController.createComment);

router.get('/edit/:id', isAuth, commentController.getEditComment); // Přidáno
router.post('/edit/:id', isAuth, [
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required')
], commentController.editComment);

router.post('/delete/:id', isAuth, commentController.deleteComment);

module.exports = router;
