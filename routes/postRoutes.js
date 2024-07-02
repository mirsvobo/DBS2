const express = require('express');
const postController = require('../controllers/postController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/create', isAuth, postController.createPost);
router.get('/', postController.getPosts);

// Přidej další routy pro update a delete

module.exports = router;
