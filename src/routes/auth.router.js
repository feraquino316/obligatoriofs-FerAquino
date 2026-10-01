const express = require('express');
const { postAuthLogin, postAuthSignup } = require('../controllers/auth.controller');
const payloadMiddleware = require('../middlewares/payload.middleware');
const { signupValidation, loginValidation } = require('./validations/user.validation');
const authRouter = express.Router();

authRouter.post("/signup", payloadMiddleware(signupValidation), postAuthSignup);
authRouter.post("/login", payloadMiddleware(loginValidation), postAuthLogin);

module.exports = authRouter;