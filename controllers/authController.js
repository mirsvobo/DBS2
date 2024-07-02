const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const University = require('../models/university');
const Dorm = require('../models/dorm');
const StudyField = require('../models/studyField');

exports.getRegister = async (req, res) => {
    const universities = await University.findAll();
    const dorms = await Dorm.findAll();
    const studyFields = await StudyField.findAll();

    res.render('auth/register', { universities, dorms, studyFields });
};

exports.postRegister = async (req, res) => {
    const { firstName, lastName, email, password, universityId, dormId, studyFieldId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            universityId,
            dormId,
            studyFieldId
        });
        const token = jwt.sign({ userId: user.id }, 'your_secret_key');
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/register');
    }
};

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.redirect('/auth/login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/auth/login');
        }
        const token = jwt.sign({ userId: user.id }, 'your_secret_key');
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/login');
    }
};

exports.postLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
};

exports.getDormsByUniversity = async (req, res) => {
    const { universityId } = req.params;
    try {
        const dorms = await Dorm.findAll({ where: { universityId } });
        res.status(200).json(dorms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
