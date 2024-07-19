import { User } from '../models/user.model.js'
import { ChangeHistory } from '../models/changeHistory.model.js'
import bcrypt from 'bcrypt'
import { generateRefreshToken, generateToken } from '../utils/tokenManager.utils.js'
import CustomError from '../utils/exception.utils.js'
import { Sequelize } from 'sequelize'

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
            const { token, expiresIn } = generateToken(USER.employeeId)
            generateRefreshToken(USER.employeeId, res)

            const USEROBJECT = USER.toJSON()
            USEROBJECT.userToken = { token, expiresIn }

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


    static async modify(request, response) {
        try {
            let { id, firstName, lastName, birthDate, address, phone, password, password2 } = request.body

            const USER = await User.findByPk(id)

            if (!USER) {
                throw new CustomError("User not found", 500, "API_MODIFY_ERROR")
            }

            if (password !== password2) {
                throw new CustomError("las contraseñas no coinciden", 400, "API_LOGIN_VALIDATE")
            }

            const OLDUSER = USER.toJSON()
            let userObject = {}
            let changes = []

            if (firstName !== "") {
                userObject.userFirstName = firstName
                changes.push(`nombre de ${OLDUSER.userFirstName} a ${firstName}`)
            } else {
                throw new CustomError("the field first name is empty", 400, "API_LOGIN_VALIDATE")
            }

            if (lastName !== "") {
                userObject.userLastName = lastName
                changes.push(`apellido de ${OLDUSER.userLastName} a ${lastName}`)
            } else {
                throw new CustomError("the field last name is empty", 400, "API_LOGIN_VALIDATE")
            }

            if (birthDate !== "") {
                userObject.userBirthDate = birthDate
                changes.push(`birthDate from ${OLDUSER.userBirthDate} to ${birthDate}`)
            } else {
                throw new CustomError("the field birth date is empty", 400, "API_LOGIN_VALIDATE")
            }

            if (address !== "") {
                userObject.userAddress = address
                changes.push(`address from ${OLDUSER.userAddress} to ${address}`)
            } else {
                throw new CustomError("the field address is empty", 400, "API_LOGIN_VALIDATE")
            }

            if (phone !== "") {
                userObject.userPhone = phone
                changes.push(`telefono de ${OLDUSER.userPhone} a ${phone}`)
            } else {
                throw new CustomError("the field phone is empty", 400, "API_LOGIN_VALIDATE")
            }

            if (password && password !== OLDUSER.userPassword) {
                const validation = await regexPassword(password)
                if (!validation) {
                    throw new CustomError("Invalid password format", 400, "API_LOGIN_VALIDATE")
                }
                userObject.userPassword = password
                changes.push(`password updated`)
            }
            await USER.update(userObject)

            await ChangeHistory.create({
                changeUserEmail: USER.userEmail,
                changeDescription: `El usuario con email ${USER.userEmail} ha modificado los siguientes campos: ${changes.join(", ")}`
            })

            return response.status(202).json({ "msg": "Usuario modificado correctamente" })

        } catch (error) {
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