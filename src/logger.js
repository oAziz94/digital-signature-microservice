const { createLogger, format, transports } = require('winston');

// Create logger instance
const logger = createLogger({
    level: 'info', // Set the default logging level (info, error, etc.)
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'logs/app.log' }) // Log to a file
    ],
});

module.exports = logger;
