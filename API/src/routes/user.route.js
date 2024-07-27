import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator, passwordBodyValidator, verifyEmailBodyValidator} from '../middlewares/managerValidator.middleware.js'
import { authValidator } from '../middlewares/authValidator.middleware.js';

export const ROUTER = Router();

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .post(tokenHeaderValidator, UserController.logout)

ROUTER.route("/refreshToken")
    .get(tokenCookieValidator, UserController.refreshToken)

ROUTER.route("/changePassword")
    .post(authValidator, passwordBodyValidator, UserController.changePassword)

ROUTER.route("/verifyEmail")
    .post(verifyEmailBodyValidator, UserController.verifyEmail)

ROUTER.route("/recoveryPassword/:resetToken")
    .post(passwordBodyValidator, UserController.recoveryPassword)

ROUTER.route("/verifyToken/:resetToken")
    .get(UserController.verifyToken)

ROUTER.route("/autoLogin/")
    .get(tokenHeaderValidator, authValidator, UserController.autoLogin)