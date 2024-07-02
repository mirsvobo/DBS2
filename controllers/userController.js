const User = require('../models/user');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { firstName, lastName, studyFieldId, universityId, dormId } = req.body;
    const userId = req.userId;

    try {
        await User.update(
            { firstName, lastName, studyFieldId, universityId, dormId },
            { where: { id: userId } }
        );
        res.status(200).json({ message: 'User updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.userId;

    try {
        await User.destroy({ where: { id: userId } });
        res.status(200).json({ message: 'User deleted!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
