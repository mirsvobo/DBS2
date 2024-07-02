const express = require('express');
const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');
const logger = require('../config/logger');

const router = express.Router();

router.get(
    '/profile',
    isAuth,
    (req, res, next) => {
        logger.info(`Get user route called for userId: ${req.user.id}`);
        next();
    },
    userController.getProfile
);

router.put(
    '/update',
    isAuth,
    (req, res, next) => {
        logger.info('Update user route called');
        next();
    },
    userController.updateUser
);

router.delete(
    '/delete',
    isAuth,
    (req, res, next) => {
        logger.info('Delete user route called');
        next();
    },
    userController.deleteUser
);

module.exports = router;
