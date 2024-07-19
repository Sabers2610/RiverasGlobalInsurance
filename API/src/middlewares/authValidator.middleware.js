import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export async function authValidator(req,res,next){
    try {

        const authHeader = req.headers['authorization'];
        
        const token = authHeader.split(' ')[1];
        
        if (!token) return res.sendStatus(401);

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({ message: 'Secret token is not defined' });
        }

        const {uid} = jwt.verify(token, jwtSecret)

        req.uid = uid

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Invalid token'})
    }
}