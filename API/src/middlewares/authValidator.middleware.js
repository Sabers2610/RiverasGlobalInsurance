import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../models/user.model.js';
import config from '../config/config.js'

export async function authValidator(req,res,next){
    try {

        const authHeader = req.headers['authorization'];
        
        const token = authHeader.split(' ')[1];
        
        if (!token) return res.sendStatus(401)

        const jwtSecret = config.jwt_secret;

        if (!jwtSecret) {
            return res.status(500).json({ message: 'Secret token is not defined' });
        }

        let {uid, expireIn} = jwt.verify(token, jwtSecret)

        const USER = User.findOne({where: {
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
        req.sessionToken = {token, expireIn}
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Invalid token'})
    }
}