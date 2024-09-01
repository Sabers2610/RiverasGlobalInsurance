import Sequelize from 'sequelize'
import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { generateRefreshToken, generateToken } from '../utils/tokenManager.util.js'
import CustomError from '../utils/exception.util.js'
import { regexPassword } from '../utils/regexPassword.util.js'
import config from '../config/config.js'
import { sendEmail } from '../utils/sendEmail.util.js'
import jwt from 'jsonwebtoken'
import { REDIS_CLIENT } from '../config/redis/redis.config.js'

export class UserController {
    static async login(req, res) {
        try {
            let user_key = `login_attemps_${req.ip}`
            let attemps = Number(await REDIS_CLIENT.get(user_key))

            if(attemps === null) {
                await REDIS_CLIENT.set(user_key, 1, {EX: 3600})
            }
            else if(attemps < 3) {
                await REDIS_CLIENT.set(user_key, attemps+1, {EX: 3600})
            }
            else {
                throw new CustomError("Too many attempts detected, please try again later.", 401, "API_AUTHENTICATION_ERROR")
            }
            let { email, password } = req.body
            const USER = await User.findOne({
                where: {
                    userEmail: email,
                    userEnabled: true
                }
            })
            if (USER === null) {
                throw new CustomError(`Email and/or password incorrect (attemps remaining: ${3-attemps}/3)`, 401, "API_AUTHENTICATION_VALIDATE")
            }
            let passwordValidate = await bcrypt.compare(password, USER.userPassword)
            if (!passwordValidate) {
                throw new CustomError(`Email and/or password incorrect (attemps remaining: ${3-attemps}/3)`, 401, "API_AUTHENTICATION_VALIDATE")
            }
            const { token, expireIn } = generateToken(USER.userId, 10, false)
            generateRefreshToken(USER.userId, res)

            const USEROBJECT = USER.toJSON()
            USEROBJECT.userToken = { token, expireIn }
            await REDIS_CLIENT.DEL(user_key)
            return res.status(202).json(USEROBJECT)
        } catch (error) {
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

    static async changePassword(req, res) {
        try {
            let { password, password2 } = req.body
            const USER = await User.findOne({
                where: {
                    userId: req.uid,
                    userEnabled: true
                }
            })

            if (!USER) {
                return res.sendStatus(401)
            }
            const VALIDPASSWORD = regexPassword(password)
            if (!VALIDPASSWORD) {
                throw new CustomError("Password format invalid", 400, "API_AUTHENTICATION_ERROR")
            }
            else if (password !== password2) {
                throw new CustomError("passwords don't match", 400, "API_AUTHENTICATION_ERROR")
            }
            USER.userPassword = password
            USER.userFirstSession = false,
                await USER.save()
            return res.status(200).json({ message: "Password changed successfully" })
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            else {
                return res.status(500).json(error.message)
            }
        }
    }

    static async refreshToken(req, res) {
        try {
            const refreshTokenClient = req.cookies.refreshToken

            if (!refreshTokenClient) {
                throw new CustomError("No refresh token provided", 401, "API_AUTHENTICATION_ERROR")
            }

            const { uid } = jwt.verify(refreshTokenClient, config.jwt_secret)
            console.log("PASAMOS EL VERIFY")
            const token = generateToken(uid, 10)

            res.status(200).json(token)
        } catch (error) {
            console.log(error)
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            return res.status(401).json(error.message)
        }
    }

    static async verifyEmail(req, res) {
        try {
            let { email } = req.body

            const USER = await User.findOne({ where: { userEmail: email, userEnabled: true } })

            if (!USER) {
                throw new CustomError("The email address doesn't exist", 401, "API_VERIFYEMAIL_ERROR")
            }
            const { token } = generateToken(USER.userId, 10, true)
            let text = `
Dear ${USER.userFirstName} ${USER.userLastName},

We have received a request to reset your password. Please click the link below to reset your password. This link will expire in 10 minutes for security reasons.

${config.url_base}recovery-password/${token}

If you did not request a password reset, please ignore this email or contact our support team for assistance.

Thank you,
Rivera's Global Insurance Support Team
            `;

            await sendEmail(USER.userEmail, "Password Recovery Request", text)
            USER.userRecoveryToken = token
            await USER.save()
            return res.status(200).json({ message: "Email send successfully", recoveryToken: token }) //ELIMINAR EL TOKEN CUANDO TERMINEN LAS PRUEBAS
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            error = new CustomError(error.message, 500, "API_SENDEMAIL_EMAIL")
            return res.status(error.code).json(error.toJson())
        }
    }

    static async recoveryPassword(req, res) {
        try {
            let { password, password2 } = req.body
            console.log(req.body)
            let { resetToken } = req.params

            const SECRET = config.jwt_secret

            if (password !== password2) {
                throw new CustomError("Passwords don't match", 400, "API_RESETPASS_ERROR")
            }
            const VALIDPASSWORD = regexPassword(password)
            if (!VALIDPASSWORD) {
                throw new CustomError("Invalid format password", 400, "API_AUTHENTICATION_ERROR")
            }
            if (!SECRET) {
                throw new CustomError("Secret token is not defined", 500, "API_SECRETOKEN_ERROR")
            }
            let { uid } = jwt.verify(resetToken, SECRET)

            const USER = await User.findByPk(uid)
            if (!USER) {
                throw new CustomError("Invalid reset token", 401, "API_RESETTOKEN_ERROR")
            }
            else if (USER.userRecoveryToken !== resetToken) {
                throw new CustomError("Invalid reset token", 401, "API_RESETTOKEN_ERROR")
            }
            USER.userPassword = password
            USER.userRecoveryToken = null
            await USER.save()
            return res.status(200).json({ message: "Password changed successfully" })
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            error = new CustomError(error.message, 500, "API_INTERNAL_ERROR")
            return res.status(error.code).json(error.toJson())
        }
    }

    static async verifyToken(req, res) {
        try {
            let { resetToken } = req.params
            console.log(resetToken)

            if (!resetToken) {
                throw new CustomError("No resetToken provided", 401, "API_RESETTOKEN_ERROR")
            }

            jwt.verify(resetToken, config.jwt_secret)

            return res.status(200).json({ message: "OK" })
        } catch (error) {
            console.log(error)
            if (error instanceof CustomError) {
                return res.status(error.code).json(error.toJson())
            }
            else if (error.name === 'TokenExpiredError' || error.name === "JsonWebTokenError") {
                error = new CustomError("Invalid token", 401, "API_RESETTOKEN_ERROR")
                return res.status(error.code).json(error.toJson())
            }
            error = new CustomError(error.message, 500, "API_RESETTOKEN_ERROR")
            return res.status(error.code).json(error.toJson())
        }
    }

    static async autoLogin(req, res) {
        try {
            const USER = await User.findByPk(req.uid)

            if (!USER) {
                throw new CustomError("User not finded", 500, "API_AUTOLOGIN_ERROR")
            }
            const USEROBJECT = USER.toJSON()
            USEROBJECT.userToken = req.sessionToken
            return res.status(200).json(USEROBJECT)
        } catch (error) {
            if(error instanceof CustomError){
                return res.status(error.code).json(error.toJson())
            }
            error = new CustomError(error.message, 500, "API_AUTOLOGIN_ERROR")
            return res.status(error.code).json(error.toJson())
        }
    }
}