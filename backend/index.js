require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('./config/logger');
const corsOptions = require('./config/cors');
const requestIdMiddleware = require('./middleware/requestId');
const { metricsMiddleware } = require('./middleware/metrics');
const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');
const summarizeRoutes = require('./routes/summarize');
const sendEmailRoutes = require('./routes/sendEmail');
const { sendErrorResponse } = require('./utils/errors');

const app = express();

// Request ID middleware
app.use(requestIdMiddleware);

// Metrics and logging middleware
app.use(metricsMiddleware);

// Compression middleware
app.use(compression());

// Security middleware
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/', metricsRoutes);
app.use('/v1', summarizeRoutes);
app.use('/v1', sendEmailRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

app.use((err, req, res, next) => {
    sendErrorResponse(res, err);
});
