// Basic metrics collection
const metrics = {
    totalRequests: 0,
    totalErrors: 0,
    responseTimes: [],
    endpointCounts: {},
    startTime: Date.now()
};

const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    metrics.totalRequests++;
    const endpoint = `${req.method} ${req.url}`;
    metrics.endpointCounts[endpoint] = (metrics.endpointCounts[endpoint] || 0) + 1;

    const logger = require('../config/logger');
    logger.info('Incoming request', {
        requestId: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - start;
        metrics.responseTimes.push(duration);
        if (res.statusCode >= 400) {
            metrics.totalErrors++;
        }
        if (metrics.responseTimes.length > 1000) {
            metrics.responseTimes.shift();
        }

        logger.info('Outgoing response', {
            requestId: req.id,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: data ? data.length : 0
        });
        originalSend.call(this, data);
    };

    next();
};

const getMetrics = () => {
    const avgResponseTime = metrics.responseTimes.length > 0
        ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
        : 0;
    const uptime = Date.now() - metrics.startTime;

    return {
        totalRequests: metrics.totalRequests,
        totalErrors: metrics.totalErrors,
        averageResponseTime: Math.round(avgResponseTime),
        endpointCounts: metrics.endpointCounts,
        uptime: uptime,
        uptimeFormatted: `${Math.floor(uptime / 1000 / 60 / 60)}h ${Math.floor(uptime / 1000 / 60 % 60)}m ${Math.floor(uptime / 1000 % 60)}s`
    };
};

module.exports = {
    metricsMiddleware,
    getMetrics
};