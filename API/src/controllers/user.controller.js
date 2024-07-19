import { User } from '../models/user.model.js'
import { UserType } from '../models/userType.model.js'
import CustomError from '../utils/exception.utils.js'
import dotenv from 'dotenv'
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'
import {generateRefreshToken, generateToken} from '../utils/tokenManager.utils.js'
dotenv.config()

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
            if (error instanceof Sequelize.ValidationError) {
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
    static async getAll(request, response) {
        try {
            const USERLIST = await User.findAll()

            if (USERLIST.length === 0) {
                throw new Error("No hay usuarios registrados")
            }
            return response.status(200).json(USERLIST)
        } catch (error) {
            console.log(error)
        }
    }
    static async findEmail(request, response) {
        try {
            const { email } = request.body; // Asegúrate de que estás extrayendo el valor de email correctamente
            const USERMAIl = await User.findOne({ where: { userEmail: email } });
            if (!USERMAIl) {
                throw new CustomError("Email not found", 401, "API_FINDONE_VALIDATE");
            }
            return response.status(200).json(USERMAIl);
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_FINDONE_VALIDATE");
                return response.status(ERROR.code).json(ERROR.toJson());
            } else if (error instanceof CustomError) {
                return response.status(error.code).json(error.toJson());
            } else {
                return response.status(500).json(error.message);
            }
        }
    }
    static async findFirstName(request, response) {
        try {
            const { firstName } = request.body; // Asegúrate de que estás extrayendo el valor de email correctamente
            const USERFIRSTNAME = await User.findOne({ where: { userFirstName: firstName } });
            console.log(USERFIRSTNAME)
            if (!USERFIRSTNAME) {
                throw new CustomError("First Name not found", 401, "API_FINDONE_VALIDATE");
            }
            return response.status(200).json(USERFIRSTNAME);
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_FINDONE_VALIDATE");
                return response.status(ERROR.code).json(ERROR.toJson());
            } else if (error instanceof CustomError) {
                return response.status(error.code).json(error.toJson());
            } else {
                return response.status(500).json(error.message);
            }
        }
    }
    static async findLastName(request, response) {
        try {
            const { lastName } = request.body; // Asegúrate de que estás extrayendo el valor de email correctamente
            const USERLASTNAME = await User.findOne({ where: { userLastName: lastName } });
            console.log(USERLASTNAME)
            if (!USERLASTNAME) {
                throw new CustomError("First Name not found", 401, "API_FINDONE_VALIDATE");
            }
            return response.status(200).json(USERLASTNAME);
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                const ERROR = new CustomError(error.message, 400, "API_FINDONE_VALIDATE");
                return response.status(ERROR.code).json(ERROR.toJson());
            } else if (error instanceof CustomError) {
                return response.status(error.code).json(error.toJson());
            } else {
                return response.status(500).json(error.message);
            }
        }
    }
}