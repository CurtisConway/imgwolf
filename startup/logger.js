const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    winston.createLogger({
        format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.timestamp()
        ),
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
            }),
            new winston.transports.File({
                filename: 'error.log',
                handleExceptions: true,
            }),
            new winston.transports.MongoDB({
                db: process.env.DB_HOST,
                handleExceptions: true,
                options: {
                    useNewUrlParser: true
                }
            })
        ],
    });

    process.on('unhandledRejection', err => {
        throw err;
    });
};