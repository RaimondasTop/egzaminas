const { body } = require('express-validator');
const validateNewTour = [
    body().notEmpty().withMessage("Request body must have data"),

    body('name')
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters'),

    body('price')
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({min: 0}) 
        .withMessage('Price must be a positive number')
        .toFloat(),
];

module.exports = validateNewTour;
