const User = require('../models/user');
const University = require('../models/university');
const Dorm = require('../models/dorm');
const StudyField = require('../models/studyField');
const Post = require('../models/post');
const Category = require('../models/category');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [
                { model: University },
                { model: Dorm },
                { model: StudyField }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.findAll({
            where: { userId: req.user.id },
            include: [{ model: Category }]
        });

        const universities = await University.findAll();
        const dorms = await Dorm.findAll({ where: { universityId: user.universityId } });
        const studyFields = await StudyField.findAll();

        res.render('users/profile', {
            title: 'Profile',
            user: user,
            posts: posts,
            universities: universities,
            dorms: dorms,
            studyFields: studyFields
        });
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [University, Dorm, StudyField]
        });
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { firstName, lastName, studyFieldId, universityId, dormId } = req.body;
    const userId = req.user.id;

    try {
        await User.update(
            { firstName, lastName, studyFieldId, universityId, dormId },
            { where: { id: userId } }
        );
        res.redirect('/users/profile');  // Redirect to profile page after update
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.destroy({ where: { id: userId } });
        res.status(200).json({ message: 'User deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserDetails = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            include: [University, Dorm, StudyField]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
