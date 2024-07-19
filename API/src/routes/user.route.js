import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator} from '../middlewares/managerValidator.middleware.js'
import { authValidator } from '../middlewares/authValidator.middleware.js'
import { adminValidator } from '../middlewares/adminValidator.middleware.js'

const ROUTER = Router()

ROUTER.route("/register")
    .post(authValidator, adminValidator, UserController.register)

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .post(tokenHeaderValidator, UserController.logout)


export default ROUTER; 