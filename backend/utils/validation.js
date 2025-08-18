const Joi = require('joi');

// Validation schemas
const summarizeSchema = Joi.object({
    transcript: Joi.string().min(1).max(100000).required(),
    prompt: Joi.string().min(1).max(1000).required()
});

const sendEmailSchema = Joi.object({
    summary: Joi.string().min(1).required(),
    recipients: Joi.string().min(1).required()
});

module.exports = {
    summarizeSchema,
    sendEmailSchema
};