const winston = require('winston');
const config = require('./../config');

function getLogPath(module) {
    return module.filename.split('/').slice(-3).join('/');
}

function log() {
    return new winston.createLogger({
        level: config.logLevel,
        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: true,
                prettyPrint: true,
                level: config.logLevel,
                label: getLogPath(module)
            })
        ]
    });
}

module.exports = {
    log: log,
};
