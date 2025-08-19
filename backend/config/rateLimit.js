const rateLimit = require('express-rate-limit');

// Rate limiters
const summarizeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many summarize requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const emailLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many email requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    summarizeLimiter,
    emailLimiter
};