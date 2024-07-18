import { User } from '../models/user.model.js'
import { UserType } from '../models/userType.model.js'
import CustomError from '../utils/exception.utils.js'
import dotenv from 'dotenv'
import sequelize from 'sequelize'
dotenv.config()

export class UserController {

    static async register(request, response){
        try {

            let {firstName, lastName, birthDate, address, phone, email, password, passwordConfirmed} = request.body
            const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()*\-_=+{};:,<.>])[A-Za-z\d!@#$%^&()*\-_=+{};:,<.>.]{8,}$/
            const USERTYPE = await UserType.findOne({where: { UserTypeName: 'operador' }})
            
            if(password !== passwordConfirmed){
                throw new CustomError("Passwords do not match", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }
            else if(!REGEX.test(passwordConfirmed)){
                throw new CustomError("Invalid password format", 400, "API_REFRESHTOKEN_UNAUTHORIZED")
            }

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

}