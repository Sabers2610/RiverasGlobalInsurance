import Sequelize from 'sequelize'
import {User} from '../models/user.models.js'
import bcrypt from 'bcrypt'
import {generateRefreshToken, generateToken} from '../utils/tokenManager.utils.js'
import CustomError from '../utils/exception.utils.js'

export class UserController {
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
            if (error instanceof Sequelize.ValidationError) {
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

    static refreshToken(req, res) {
        try {
            const refreshTokenClient = req.cookies.refreshToken
    
            if (!refreshTokenClient) {
                throw new CustomError("No token provided", 401, "API_REFRESHTOKEN_UNAUTHORIZED")
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
}