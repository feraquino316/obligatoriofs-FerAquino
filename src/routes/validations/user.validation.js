const joi = require('joi');

const signupValidation = joi.object({
    username: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required()
});

const loginValidation = joi.object({
    username: joi.string().min(2).max(30).required(),
    password: joi.string().min(6).max(30).required()
});

module.exports = {
    signupValidation,
    loginValidation
};