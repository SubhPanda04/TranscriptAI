const express = require('express');
const { getMetrics } = require('../middleware/metrics');
const router = express.Router();

router.get('/metrics', (req, res) => {
    res.json(getMetrics());
});

module.exports = router;