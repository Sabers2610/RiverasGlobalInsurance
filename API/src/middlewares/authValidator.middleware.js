import dotenv from 'dotenv'
dotenv.config()

export async function authValidator(req,res,next){
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        const jwtSecret = process.env.JWT_SECRET_KEY;

        if (!jwtSecret) {
            return res.status(500).json({ message: 'Secret token is not defined' });
        }

        const USER = await USER.findByPk(uid)
        const TYPEUSER = await UserType.findByPk(USER.UserType)
        if (TYPEUSER.userTypeName.toUpperCase() !== "ADMIN"){
            return res.status(401).json({ message: 'Access denied' });
        }
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token'})
    }
}