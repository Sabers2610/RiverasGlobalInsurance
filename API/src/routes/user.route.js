import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator} from '../middlewares/managerValidator.middleware.js'

export const ROUTER = Router();

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .post(tokenHeaderValidator, UserController.logout)