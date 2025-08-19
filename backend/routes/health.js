const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'MangoDesk Backend API is running!', status: 'healthy' });
});

router.get('/health', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {}
    };

    // Check Gemini API connectivity
    try {
        const testResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: 'Test'
                    }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 10
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            }
        );
        health.services.gemini = 'healthy';
    } catch (err) {
        health.services.gemini = 'unhealthy';
        health.status = 'degraded';
    }

    health.services.email = process.env.EMAIL_USER && process.env.EMAIL_PASS ? 'configured' : 'not configured';

    res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

module.exports = router;