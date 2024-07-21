import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator, passwordBodyValidator} from '../middlewares/managerValidator.middleware.js'
import { authValidator } from '../middlewares/authValidator.middleware.js'
import { adminValidator } from '../middlewares/adminValidator.middleware.js'

const ROUTER = Router()

ROUTER.route("/register")
    .post(adminValidator, UserController.register)

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .post(tokenHeaderValidator, UserController.logout)

ROUTER.route("/refreshToken")
    .post(tokenCookieValidator, UserController.refreshToken)

ROUTER.route("/changePassword")
    .post(passwordBodyValidator, authValidator, UserController.changePassword)


export default ROUTER; 