import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { adminValidator } from "../middlewares/adminValidator.middleware.js";

const ROUTER = Router()

ROUTER.route("/register")
    .post(UserController.register)

ROUTER.route("/getAll")
    .get(adminValidator ,UserController.getAll)

ROUTER.route("/findEmail")
    .post(adminValidator ,UserController.findEmail)

ROUTER.route("/findFirstName")
    .post(adminValidator ,UserController.findFirstName)

ROUTER.route("/findLastName")
    .post(adminValidator ,UserController.findLastName)

ROUTER.route("/login")
    .post(UserController.login)

export default ROUTER; 