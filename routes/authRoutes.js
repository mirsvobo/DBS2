const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
], authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', [
    body('firstName').trim().not().isEmpty().withMessage('First name is required'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
], authController.postRegister);

router.post('/logout', authController.postLogout);

// Přidáno
router.get('/dorms/:universityId', authController.getDormsByUniversity);

module.exports = router;
