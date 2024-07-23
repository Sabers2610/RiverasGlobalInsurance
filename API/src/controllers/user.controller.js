import { User } from '../models/user.model.js'
import { UserType } from '../models/userType.model.js'
import CustomError from '../utils/exception.utils.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import Sequelize from 'sequelize'
import {generateRefreshToken, generateToken} from '../utils/tokenManager.utils.js'
import { regexPassword } from '../utils/regexPassword.utils.js'
dotenv.config()

export class UserController {

    static async register(request, response){
        try {

            let {firstName, lastName, birthDate, address, phone, email} = request.body
            const USERTYPE = await UserType.findOne({where: { UserTypeName: 'operador' }})

            await User.create({
                userFirstName: firstName,
                userLastName :lastName,
                userBirthDate: birthDate,
                userAddress: address,
                userPhone: phone,
                userEmail: email,
                userTypeId: USERTYPE.userTypeId
            })

            return response.status(202).json({"msg" : "User created sucessfully"})

        } catch (error) {
            if(error instanceof Sequelize.ValidationError){
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
            const USER = await User.findOne({ where: {
                userEmail: email,
                userEnabled: true
            } })

            if (USER === null) {
                throw new CustomError("Email and/or password incorrect", 401, "API_AUTHENTICATION_VALIDATE")
            }
            let passwordValidate = await bcrypt.compare(password, USER.userPassword)
            if (!passwordValidate) {
                throw new CustomError("Email and/or password incorrect", 401, "API_AUTHENTICATION_VALIDATE")
            }
            const {token, expireIn} = generateToken(USER.userId)
            generateRefreshToken(USER.userId, res)

            const USEROBJECT = USER.toJSON()
            USEROBJECT.userToken = {token, expireIn}

            return res.status(202).json(USEROBJECT)
        } catch (error) {
            console.log(error)
            if (error instanceof Sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_AUTHENTICATION_VALIDATE")
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

    static async firstSession(req, res){
        try {
            let { password, password2 } = request.body
            const USER = await User.findOne({where: {
                userId: req.uid,
                userEnabled: true
            }})

            if(!USER){
                return res.sendStatus(401)
            }
            const VALIDPASSWORD = regexPassword(password)
            if(!VALIDPASSWORD) {
                throw new CustomError("Password format invalid", 401, "API_AUTHENTICATION_ERROR")
            }
            else if(password !== password2){
                throw new CustomError("passwords don't match", 401, "API_AUTHENTICATION_ERROR")
            }

            USER.userpassword = password
            await USER.save()
            return res.status(200).json({message: "Password changed successfully"})
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            else {
                return res.status(500).json(error.message)
            }
        }
    }

    static refreshToken(req, res) {
        try {
            const refreshTokenClient = req.cookies.refreshToken
    
            if (!refreshTokenClient) {
                throw new CustomError("No refresh token provided", 401, "API_AUTHENTICATION_ERROR")
            }
    
            const { uid } = JWT.verify(refreshTokenClient, process.env.JWT_SECRET_REFRESH)
    
            const token = generateToken(uid)
    
            res.status(200).json(token)
        } catch (error) {
            console.log(error)
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            return res.status(401).json(error.message)
        }
    }

    static async changePassword(req, res){
        try {
            let { password, password2 } = req.body
            console.log(req.uid)
            const USER = await User.findOne({where: {
                userId: req.uid,
                userEnabled: true
            }})
            console.log(USER)

            if(!USER){
                return res.sendStatus(401)
            }
            const VALIDPASSWORD = regexPassword(password)
            if(!VALIDPASSWORD) {
                throw new CustomError("Password format invalid", 401, "API_AUTHENTICATION_ERROR")
            }
            else if(password !== password2){
                throw new CustomError("passwords don't match", 401, "API_AUTHENTICATION_ERROR")
            }

            USER.userPassword = password
            USER.userFirstSession = false,
            USER.userPasswordChanged = false
            await USER.save()
            return res.status(200).json({message: "Password changed successfully"})
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            else {
                return res.status(500).json(error.message)
            }
        }
    }
}