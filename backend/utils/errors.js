// Custom error classes
class APIError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

class ValidationError extends APIError {
    constructor(message, details = null) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

class ExternalAPIError extends APIError {
    constructor(message, details = null) {
        super(message, 502, details);
        this.name = 'ExternalAPIError';
    }
}

// Error response helper
const sendErrorResponse = (res, error) => {
    const statusCode = error.statusCode || 500;
    const response = {
        success: false,
        error: error.message,
        ...(error.details && { details: error.details })
    };

    // Log error
    const logger = require('../config/logger');
    if (statusCode >= 500) {
        logger.error('Server error', { error: error.message, stack: error.stack, statusCode });
    } else {
        logger.warn('Client error', { error: error.message, statusCode });
    }

    res.status(statusCode).json(response);
};

module.exports = {
    APIError,
    ValidationError,
    ExternalAPIError,
    sendErrorResponse
};