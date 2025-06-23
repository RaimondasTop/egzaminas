const { body } = require('express-validator');
const validateNewBook = [
    body().notEmpty().withMessage("Request body must have data"),

    body('title')
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
];

module.exports = validateNewBook;
