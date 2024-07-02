const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretkey');
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!decodedToken) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    req.userId = decodedToken.userId;
    next();
};
