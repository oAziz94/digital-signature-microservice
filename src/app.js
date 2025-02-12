const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const verifySignatureRoute = require('./routes/verifySignature');

// Define a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
        });
    },
});

const app = express();
app.use(limiter);
const PORT = process.env.PORT || 3000;

// Use morgan for HTTP request logging
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()) // Send logs to winston
    }
}));

// Middleware
app.use(express.json());
app.use(helmet()); // Add security headers

// Routes
app.use('/healthCheck', require('./routes/healthCheck'));
app.use('/verifySignature', verifySignatureRoute);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
