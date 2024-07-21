import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import CustomError from './exception.utils.js'
dotenv.config()

export function generateToken(uid){
    const expireIn = 60 * 10 // 10 minutos
    try {
        const token = JWT.sign({uid}, process.env.JWT_SECRET, {expiresIn: expireIn})

        return {token, expireIn}
    } catch (error) {
        console.log(error)
        throw new CustomError(error.message, 500, "API_GENERATE_TOKEN_ERROR")
    }
}

export function  generateRefreshToken(uid, res){
    const expireIn = 60 * 60 * 24 * 30 // 30 dias
    try {
        const token = JWT.sign({uid}, process.env.JWT_SECRET, {expiresIn: expireIn})

        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: !(process.env.NODE_MODE === "developer"),
            expires: new Date(Date.now() + expireIn * 1000)
        })
    } catch (error) {
        console.log(error)
        throw new CustomError(error.message, 500, "API_GENERATE_REFRESHTOKEN_ERROR")
    }
}