const { randomUUID } = require('crypto');
const requestIdMiddleware = (req, res, next) => {
    req.id = randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
};

module.exports = requestIdMiddleware;