const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const handleCastErrorDB = (error) => new AppError(`Invalid ${error.path}: ${error.value}`, 400);

const handleDuplicateKeyErrorDB = (error) => {
    const fieldNames = Object.keys(error.keyValue || {});
    const duplicateFields = fieldNames.length ? fieldNames.join(', ') : 'resource';
    return new AppError(`${duplicateFields} already exists.`, 409);
};

const handleValidationErrorDB = (error) => {
    const messages = Object.values(error.errors).map((validationError) => validationError.message);
    return new AppError(messages.join('. '), 400);
};

const errorHandler = (error, req, res, next) => {
    let responseError = { ...error };
    responseError.message = error.message;

    if (error instanceof mongoose.Error.CastError) responseError = handleCastErrorDB(error);
    if (error.code === 11000) responseError = handleDuplicateKeyErrorDB(error);
    if (error instanceof mongoose.Error.ValidationError) responseError = handleValidationErrorDB(error);

    const statusCode = responseError.statusCode || 500;
    const status = responseError.status || 'error';
    const message = responseError.message || 'Something went wrong. Please try again.';

    res.status(statusCode).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

module.exports = errorHandler;
