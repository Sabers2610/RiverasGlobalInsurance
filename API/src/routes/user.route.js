import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import {loginBodyValidator, tokenCookieValidator, tokenHeaderValidator, passwordBodyValidator, verifyEmailBodyValidator} from '../middlewares/managerValidator.middleware.js'
import { authValidator } from '../middlewares/authValidator.middleware.js';
import { adminValidator } from '../middlewares/adminValidator.middleware.js';


export const ROUTER = Router();

ROUTER.route("/login")
    .post(loginBodyValidator, UserController.login)

ROUTER.route("/logout")
    .get(tokenHeaderValidator, UserController.logout)

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

ROUTER.route("/register")
    .post(adminValidator, UserController.register)

ROUTER.route("/getAll")
    .get(adminValidator ,UserController.getAll)

ROUTER.route("/findEmail")
    .post(adminValidator ,UserController.findEmail)

ROUTER.route("/findFirstName")
    .post(adminValidator ,UserController.findFirstName)

ROUTER.route("/findLastName")
    .post(adminValidator ,UserController.findLastName)

ROUTER.route("/user/:id")
    .get(adminValidator, UserController.findById)

ROUTER.route("/adminModify/:id") 
    .post(adminValidator, UserController.adminModify)

ROUTER.route("/userDisable/:id")
    .get(adminValidator, UserController.disableUser)

ROUTER.route("/modifyUser")
    .post(authValidator, UserController.modify)