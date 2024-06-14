import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'app.log' })
    ]
});

const customFormat = winston.format.printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

logger.transports[0].format = customFormat;

export {
    logger
}
