import { User } from '../models/user.model.js'
import { ChangeHistory } from '../models/changeHistory.model.js'
import bcrypt from 'bcrypt'
import { generateRefreshToken, generateToken } from '../utils/tokenManager.utils.js'
import CustomError from '../utils/exception.utils.js'
import { Sequelize } from 'sequelize'
import { regexPassword } from '../utils/regexPassword.utils.js'




export class UserController {
    static async login(req, res) {
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


    static async register(request, response) {
        try {

            let { firstName, lastName, birthDate, address, phone, email, password, passwordConfirmed } = request.body
            const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/
            const USERTYPE = await UserType.findOne({ where: { UserTypeName: 'operador' } })

            if (password !== passwordConfirmed) {
                throw new CustomError("Passwords do not match", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }
            else if (!REGEX.test(passwordConfirmed)) {
                throw new CustomError("Invalid password format", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }
            await User.create({
                userFirstName: firstName,
                userLastName: lastName,
                userBirthDate: birthDate,
                userAddress: address,
                userPhone: phone,
                userEmail: email,
                userPassword: password,
                userTypeId: USERTYPE.userTypeId
            })
            return response.status(202).json({ "msg": "User created sucessfully" })

        } catch (error) {
            if (error instanceof sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_REGISTER_VALIDATE")
                return response.status(ERROR.code).json(ERROR.toJson())
            }
            else if (error instanceof CustomError) {
                return response.status(401).json(error.toJson())
            }
            else {
                return response.status(500).json(error.message)
            }
        }
    }


    static async modify(request, response) {
        try {
            let { firstName, lastName, birthDate, address, phone, password, password2 } = request.body
    
            const USER = await User.findByPk(request.uid)
            if (!USER) {
                throw new CustomError("User not found", 500, "API_MODIFY_ERROR")
            }
    
            if (password !== password2) {
                throw new CustomError("Passwords do not match", 400, "API_LOGIN_VALIDATE")
            }
    
            const OLDUSER = USER.toJSON()
            let changes = []
            const USEROBJECT = {}
    
            if (firstName !== "" && firstName !== OLDUSER.userFirstName) {
                USER.userFirstName = firstName
                changes.push(`first name from ${OLDUSER.userFirstName} to ${firstName}`)
                
            }
    
            if (lastName !== "" && lastName !== OLDUSER.userLastName) {
                USER.userLastName = lastName
                changes.push(`last name from ${OLDUSER.userLastName} to ${lastName}`)
            }
    
            if (birthDate !== "" && birthDate !== OLDUSER.userBirthDate) {
                USER.userBirthDate = birthDate
                changes.push(`birth date from ${OLDUSER.userBirthDate} to ${birthDate}`)
            }
    
            if (address !== "" && address !== OLDUSER.userAddress) {
                USER.userAddress = address
                changes.push(`address from ${OLDUSER.userAddress} to ${address}`)
            }
    
            if (phone !== "" && phone !== OLDUSER.userPhone) {
                USER.userPhone = phone
                changes.push(`phone from ${OLDUSER.userPhone} to ${phone}`)
            }
    
            if (password !== "") {
                const validation = regexPassword(password)
                if (!validation) {
                    throw new CustomError("Invalid password format", 400, "API_LOGIN_VALIDATE")
                } else {
                    USER.userPassword = password
                    changes.push(`password updated`)
                }
            }
    
            await USER.save()
    
            if (changes.length > 0) {
                await ChangeHistory.create({
                    changeUserEmail: USER.userEmail,
                    changeDescription: `The user with email ${USER.userEmail} has modified the following fields: ${changes.join(", ")}`
                })
            }
    
            return response.status(202).json({ "msg": "User successfully modified" })
    
        } catch (error) {
            console.log(error)
            if (error instanceof Sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_REGISTER_VALIDATE")
                return response.status(ERROR.code).json(ERROR.toJson())
            }
            else if (error instanceof CustomError) {
                return response.status(error.code).json(error.toJson())
            }
            else {
                return response.status(500).json(error.message)
            }
        }
    }
}