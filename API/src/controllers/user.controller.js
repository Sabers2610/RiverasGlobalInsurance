import { User } from '../models/user.model.js'
import { UserType } from '../models/userType.model.js'
import CustomError from '../utils/exception.utils.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import sequelize from 'sequelize'
import {generateRefreshToken, generateToken} from '../utils/tokenManager.utils.js'
dotenv.config()

export class UserController {

    static async register(request, response){
        try {

            let {firstName, lastName, birthDate, address, phone, email, password, passwordConfirmed} = request.body
            const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/
            const USERTYPE = await UserType.findOne({where: { UserTypeName: 'operador' }})
            console.log("entre al try")
            if(password !== passwordConfirmed){
                throw new CustomError("Passwords do not match", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }
            else if(!REGEX.test(passwordConfirmed)){
                throw new CustomError("Invalid password format", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }
            console.log("antes de crear")
            await User.create({
                userFirstName: firstName,
                userLastName :lastName,
                userBirthDate: birthDate,
                userAddress: address,
                userPhone: phone,
                userEmail: email,
                userPassword: password,
                userTypeId: USERTYPE.userTypeId
            })
            return response.status(202).json({"msg" : "User created sucessfully"})
            console.log("creado")

        } catch (error) {
            if(error instanceof sequelize.ValidationError){
                const ERROR = new CustomError(error.message, 400, "API_REGISTER_VALIDATE")
                return response.status(ERROR.code).json(ERROR.toJson())
            }
            else if(error instanceof CustomError){
                return response.status(401).json(error.toJson())
            }
            else{
                return response.status(500).json(error.message)
            }
        }
    }

    static async login(req, res){
        try {
            let { email, password } = req.body
            const USER = await User.findOne({ where: { userEmail: email } })
            if (USER === null) {
                throw new CustomError("Email and/or password incorrect", 401, "API_LOGIN_VALIDATE")
            }
            let passwordValidate = await bcrypt.compare(password, USER.userPassword)
            if (!passwordValidate) {
                throw new CustomError("Email and/or password incorrect", 401, "API_LOGIN_VALIDATE")
            }
            const token = generateToken(USER.userId)
            generateRefreshToken(USER.userId, res)

            const USEROBJECT = USER.toJSON()
            USEROBJECT.userToken = token

            return res.status(202).json(USEROBJECT)
        } catch (error) {
            console.log(error)
            if (error instanceof sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_LOGIN_VALIDATE")
                return res.status(ERROR.code).json(ERROR.toJson())
            }
            else if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            else {
                return res.status(500).json(error.message)
            }
        }
    }

    static async logout(req, res) {
        res.clearCookie("refreshToken")
        res.end()
    }

}