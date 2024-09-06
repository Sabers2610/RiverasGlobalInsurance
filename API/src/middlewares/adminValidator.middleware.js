import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'
import {UserType} from '../models/userType.model.js'
import dotenv from 'dotenv'
dotenv.config()

export async function adminValidator(req,res,next){
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header not present' });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token){
            return res.status(401).json({ message: 'Token not defined' });
        } 

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({ message: 'Secret token is not defined' });
        }


        const {uid} = jwt.verify(token, jwtSecret)


        const USER = await User.findOne({where: {
            userId: uid,
            userEnabled: true
        }})
        if(!USER){
            return res.sendStatus(401)
        }

        if(USER.userRecoveryToken && USER.userRecoveryToken === token) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        req.uid = uid

        const TYPEUSER = await UserType.findOne({where:{
            userTypeId: USER.userTypeId
        }})

        if (TYPEUSER.userTypeName.toUpperCase() !== "ADMIN"){
            return res.status(401).json({ message: 'Access denied' });
        }

        next()
    } catch (error) {
        return res.status(401).json(error)
    }
}