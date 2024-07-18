import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const ROUTER = Router()

ROUTER.route("/register")
    .post(UserController.register)

export default ROUTER; 