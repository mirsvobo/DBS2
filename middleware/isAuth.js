const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        logger.warn('No Authorization header provided');
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretkey');
    } catch (err) {
        logger.error('Failed to verify token:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (!decodedToken) {
        logger.warn('Token verification failed');
        return res.status(401).json({ error: 'Not authenticated' });
    }

    req.userId = decodedToken.userId;
    next();
};
