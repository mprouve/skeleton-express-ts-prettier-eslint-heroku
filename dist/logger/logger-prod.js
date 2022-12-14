"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, errors, json } = winston_1.format;
const buildLoggerProd = () => {
    // Transport to print logs to console
    const consoleTransport = new winston_1.transports.Console();
    // Transport to print all error logs to errors.log file
    const errorsFileTransport = new winston_1.transports.DailyRotateFile({
        level: 'error',
        filename: 'logs/errors-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d'
    });
    // Transport to create a log rotation for combined logs
    const combinedFileRotateTransport = new winston_1.transports.DailyRotateFile({
        level: 'http',
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d'
    });
    const fileExceptionHandler = new winston_1.transports.File({ filename: 'logs/exceptions.log' });
    const fileRejectionHandler = new winston_1.transports.File({ filename: 'logs/rejections.log' });
    /**
     * The below 4 listeners can be uncomment to run code during specific events:
     * 1) When a log file is created
     * 2) When a log file is rotated
     * 3) when a log file is archived
     * 4) when a log file is deleted
     */
    // combinedFileRotateTransport.on('new', (filename) => {})
    // combinedFileRotateTransport.on('rotate', (oldFilename, newFilename) => {})
    // combinedFileRotateTransport.on('archive', (zipFilename) => {})
    // combinedFileRotateTransport.on('logRemoved', (removedFilename) => {})
    const logger = (0, winston_1.createLogger)({
        level: 'http',
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'user-service' },
        transports: [consoleTransport, errorsFileTransport, combinedFileRotateTransport],
        exceptionHandlers: [fileExceptionHandler],
        rejectionHandlers: [fileRejectionHandler]
    });
    return logger;
};
exports.default = buildLoggerProd;
