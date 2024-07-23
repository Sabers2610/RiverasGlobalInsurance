import {body, header, cookie, validationResult, } from 'express-validator'

function validationResultExpress(req, res, next){
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    next();
}

export const loginBodyValidator = [
    body("email", "Invalid email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .escape(),
    body("password", "Invalid format password")
        .trim()
        .isLength({min: 8, max: 20})
        .notEmpty()
        .escape(),
        validationResultExpress
]

export const tokenHeaderValidator = [
    header("authorization", "Invalid Token")
        .trim()
        .notEmpty()
        .withMessage("Authorization header cannot be empty")
        .matches(/^Bearer\s+\S+$/)
        .withMessage("Invalid token format"),
        validationResultExpress
]

export const tokenCookieValidator = [
    cookie("refreshToken", "Invalid refresh token")
        .trim()
        .notEmpty()
        .escape(),
        validationResultExpress
]