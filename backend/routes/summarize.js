const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const validator = require('validator');
const { summarizeSchema } = require('../utils/validation');
const { ValidationError, ExternalAPIError } = require('../utils/errors');
const { summarizeLimiter } = require('../config/rateLimit');

const router = express.Router();

// Configure axios retry for Gemini API
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           (error.response && (error.response.status >= 500 || error.response.status === 429));
  }
});

router.post('/summarize', summarizeLimiter, async (req, res) => {
    const { error, value } = summarizeSchema.validate(req.body);
    if (error) {
        throw new ValidationError('Invalid input', error.details[0].message);
    }
    const { transcript, prompt } = value;

    // Sanitize inputs
    const sanitizedTranscript = validator.escape(transcript.trim());
    const sanitizedPrompt = validator.escape(prompt.trim());

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: `You are a helpful meeting summarizer. ${sanitizedPrompt}\n\n${sanitizedTranscript}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 512
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 
            }
        );

        const summary = response.data.candidates[0].content.parts[0].text;
        res.json({ success: true, summary });
    } catch (err) {
        if (err instanceof ValidationError) {
            throw err;
        }
        throw new ExternalAPIError('Failed to generate summary', err.response?.data?.error?.message || err.message);
    }
});

module.exports = router;