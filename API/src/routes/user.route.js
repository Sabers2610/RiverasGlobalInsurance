import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator, passwordBodyValidator} from '../middlewares/managerValidator.middleware.js'

export const ROUTER = Router();

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .post(tokenHeaderValidator, UserController.logout)

ROUTER.route("/refreshToken")
    .post(tokenCookieValidator, UserController.refreshToken)

ROUTER.route("/changePassword")
    .post(passwordBodyValidator, UserController.changePassword)