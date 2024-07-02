const express = require('express');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/:userId', isAuth, userController.getUser);
router.put('/update', isAuth, userController.updateUser);
router.delete('/delete', isAuth, userController.deleteUser);

module.exports = router;
