import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const ROUTER = Router()

ROUTER.route("/register")
    .post(UserController.register)

ROUTER.route("/getAll")
    .get(UserController.getAll)

ROUTER.route("/findEmail")
    .post(UserController.findEmail)

ROUTER.route("/findFirstName")
    .post(UserController.findFirstName)

ROUTER.route("/findLastName")
    .post(UserController.findLastName)

export default ROUTER; 