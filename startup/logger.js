const winston = require('winston');

module.exports = function () {
    winston.createLogger({
        level: 'error',
        format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.timestamp()
        ),
        transports: [
            new winston.transports.File({
                filename: 'error.log',
                level: 'error',
                handleExceptions: true,
            }),
            new winston.transports.Console({
                handleExceptions: true,
            }),
        ],
    });

    process.on('unhandledRejection', err => {
        throw err;
    });
};