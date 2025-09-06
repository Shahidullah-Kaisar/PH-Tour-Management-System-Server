"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (error) => {
    const errorSources = [];
    const errors = Object.values(error.errors); //Object.values(obj) একটা object-এর সব value গুলোকে array আকারে দেয়।
    errors.forEach((errorObject) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    };
};
exports.handleValidationError = handleValidationError;
